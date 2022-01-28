#!/bin/bash

#docker volume create build-contracts

SOLIDITY_VERSION=0.8.9
CONTRACT_NAME=NonCompoundingRewardsPool
CONTRACT_PATH=contracts/V2
GO_PKG=staker

docker build -t node:10.17-mine - << EOF
FROM node:10.17
WORKDIR /.npm
RUN chown -R $(id -u):$(id -g) /.npm
WORKDIR /.config
RUN chown -R $(id -u):$(id -g) /.config
EOF

docker run --rm -ti --user $(id -u):$(id -g) -v $(pwd):/src --workdir /src node:10.17-mine npm install

docker build -t solc:${SOLIDITY_VERSION}-vol - << EOF
FROM ethereum/solc:${SOLIDITY_VERSION} as build

FROM alpine:latest
COPY --from=build /usr/bin/solc /usr/bin/

RUN mkdir -p /build && chmod -R a+w /build

VOLUME ["/build"]

ENTRYPOINT ["/usr/bin/solc"]
EOF

docker run --rm \
  --user $(id -u):$(id -g) \
  -v $(pwd):/root \
  -v build-contracts:/build \
  solc:${SOLIDITY_VERSION}-vol \
  @openzeppelin/=/root/node_modules/@openzeppelin/ --abi /root/${CONTRACT_PATH}/${CONTRACT_NAME}.sol --allow-paths '' -o /build

docker build -t abigen:mine - << EOF
FROM ethereum/solc:${SOLIDITY_VERSION} as build

FROM golang:latest
COPY --from=build /usr/bin/solc /usr/bin/
RUN git clone https://github.com/ethereum/go-ethereum
RUN cd ./go-ethereum && make && make devtools

ENTRYPOINT ["abigen"]
EOF

docker run \
  --rm \
  --user $(id -u):$(id -g) \
  -v build-contracts:/build \
  -v $(pwd)/go-staker/staker:/out \
  abigen:mine --abi=/build/${CONTRACT_NAME}.abi --pkg=${GO_PKG} --out=/out/${CONTRACT_NAME}.go

docker volume rm build-contracts