import { ethers } from 'hardhat';
import { getSelectors, FacetCutAction } from './libraries/diamond';

export async function deployDiamond(masterDiamondAddress: string, facets: { name: string; address: string }[]) {
  const accounts = await ethers.getSigners();
  const contractOwner = accounts[0];

  // show DiamondCutFacet
  console.log('DiamondCutFacet deployed:', facets[0].address);

  // deploy Diamond
  const Diamond = await ethers.getContractFactory('Diamond');
  const diamond = await Diamond.deploy(contractOwner.address, facets[0].address, masterDiamondAddress);
  await diamond.deployed();
  console.log('Diamond deployed:', diamond.address);

  // deploy DiamondInit
  // DiamondInit provides a function that is called when the diamond is upgraded to initialize state variables
  // Read about how the diamondCut function works here: https://eips.ethereum.org/EIPS/eip-2535#addingreplacingremoving-functions
  console.log('DiamondInit deployed:', facets[1].address);

  // deploy facets
  console.log('');
  console.log('Deploying facets');
  const facetsToGet = [
    { name: facets[2].name, address: facets[2].address },
    { name: facets[3].name, address: facets[3].address },
    { name: facets[4].name, address: facets[4].address },
  ];
  const cut = [];
  for (const actualFacet of facetsToGet) {
    const facet = await ethers.getContractFactory(actualFacet.name);
    console.log(`${actualFacet.name} deployed: ${actualFacet.address}`);
    cut.push({
      facetAddress: actualFacet.address,
      action: FacetCutAction.Add,
      functionSelectors: getSelectors(facet),
    });
  }

  // upgrade diamond with facets
  const diamondCut = await ethers.getContractAt('IDiamondCut', diamond.address);
  let tx;
  let receipt;
  // call to init function
  let diamondInit = await ethers.getContractAt('DiamondInit', facets[1].address);
  let functionCall = diamondInit.interface.encodeFunctionData('init');
  tx = await diamondCut.diamondCut(cut, diamondInit.address, functionCall);
  console.log('Diamond cut tx: ', tx.hash);
  receipt = await tx.wait();
  if (!receipt.status) {
    throw Error(`Diamond upgrade failed: ${tx.hash}`);
  }
  console.log('Completed diamond cut');
  return diamond.address;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  deployDiamond(ethers.constants.AddressZero, []) // @TODO add the facets here when running own script
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

exports.deployDiamond = deployDiamond;
