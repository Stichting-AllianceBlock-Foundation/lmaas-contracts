#!/bin/bash

if [ "$#" -ne 4 ]; then
  # print help
  echo "==========================================================="
  echo "GO source code generator"
  echo "Usage: $0 <contract_path> <contract_name> <go_pkg> <go_path>"
  echo ""
  echo "Example: "
  echo ""
  echo "  $0 contracts/V2 NonCompoundingRewardsPool staker staker"
  echo ""
  echo "will create: ./go-staker/staker/NonCompoundingRewardsPool.go"
  echo "based on: ./contracts/V2/NonCompoundingRewardsPool.sol"
  echo ""
  echo "  $0 contracts StakeLock lock staker/lock"
  echo ""
  echo "will create: ./go-staker/staker/lock/StakeLock.go"
  echo "based on: ./contracts/StakeLock.sol"
  echo "==========================================================="
  exit 1
fi

CONTRACT_PATH=$1
CONTRACT_NAME=$2
GO_PKG=$3
# we can choose to place the files in a deeper hierachy inside the module. normally the last segment should match the package name
GO_PATH=$4

CURRENT_USER=$(id -u):$(id -g)
GO_MOD_BASENAME=go-staker

SOLIDITY_VERSION=$(grep -E "pragma solidity [^;]+;" ${CONTRACT_PATH}/${CONTRACT_NAME}.sol | cut -d' ' -f3 | tr -d ';')
NODE_VERSION=10.17

echo "==========================================================="
echo "Generate GO source code in package: ${GO_PKG}, at path: ${GO_PATH}"
echo "For contract: ${CONTRACT_PATH}/${CONTRACT_NAME}"
echo "Node: ${NODE_VERSION}"
echo "Solidity: ${SOLIDITY_VERSION}"
echo "==========================================================="

echo "Temporary volume for build files:"
docker volume create build-contracts
echo 

echo "Prepare a custom image for Node (${NODE_VERSION})"
# Necessary since I am running the actual build in the container,
# using a user different than root
# commands in the format $(...) run on the host and docker build runs with their results
docker build -q -t node:${NODE_VERSION}-custom - << EOF
FROM node:${NODE_VERSION}
WORKDIR /.npm
RUN chown -R ${CURRENT_USER} /.npm
WORKDIR /.config
RUN chown -R ${CURRENT_USER} /.config
EOF
echo 

# Build the current project with the required Node version (useful when Node is not available at the exact version)
docker run --rm --user ${CURRENT_USER} -v $(pwd):/src --workdir /src node:${NODE_VERSION}-custom npm install

echo "Prepare a custom image for Solc (${SOLIDITY_VERSION})"
# Solc (Solidity compiler). 
# The build stage is there only to copy the solc binary. building it from source would take longer
docker build -q -t solc:${SOLIDITY_VERSION}-vol - << EOF
FROM ethereum/solc:${SOLIDITY_VERSION} as build

FROM alpine:latest
COPY --from=build /usr/bin/solc /usr/bin/

RUN mkdir -p /build && chmod -R a+w /build

VOLUME ["/build"]

ENTRYPOINT ["/usr/bin/solc"]
EOF
echo

echo "Compile contract: ${CONTRACT_PATH}/${CONTRACT_NAME}.sol"
docker run --rm \
  --user ${CURRENT_USER} \
  -v $(pwd):/root \
  -v build-contracts:/build \
  solc:${SOLIDITY_VERSION}-vol \
  @openzeppelin/=/root/node_modules/@openzeppelin/ --abi /root/${CONTRACT_PATH}/${CONTRACT_NAME}.sol --allow-paths '' -o /build
echo

echo "Prepare a custom image for Abigen (latest)"
# abigen needs solc, hence the build stage
docker build -q -t abigen:custom - << EOF
FROM ethereum/solc:${SOLIDITY_VERSION} as build

FROM golang:latest
COPY --from=build /usr/bin/solc /usr/bin/
RUN git clone https://github.com/ethereum/go-ethereum
RUN cd ./go-ethereum && make && make devtools

ENTRYPOINT ["abigen"]
EOF
echo

echo "Generate GO source code"
docker run \
  --rm \
  --user ${CURRENT_USER} \
  -v build-contracts:/build \
  -v $(pwd)/${GO_MOD_BASENAME}/${GO_PATH}:/out \
  abigen:custom --abi=/build/${CONTRACT_NAME}.abi --pkg=${GO_PKG} --out=/out/${CONTRACT_NAME}.go
echo

echo Cleanup
docker volume rm build-contracts
docker image rm abigen:custom
docker image rm solc:${SOLIDITY_VERSION}-vol
docker image rm node:${NODE_VERSION}-custom