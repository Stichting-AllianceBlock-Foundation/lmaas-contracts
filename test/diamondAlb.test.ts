import {
  getSelector,
  getSelectors,
  FacetCutAction,
  removeSelectors,
  findAddressPositionInFacets,
} from '../scripts/libraries/diamond';
import { ethers } from 'hardhat';

import { deployDiamond } from '../scripts/deployDiamond';

import { assert } from 'chai';
import { deployMasterDiamond } from '../scripts/deployMasterDiamond';

describe('[Diamond Test]', async function () {
  let diamondAddress: string;
  let diamondInitAddress: string;
  let diamondCutFacet: any;
  let diamondCutFacetAddress: string;
  let diamondLoupeFacet: any;
  let diamondLoupeFacetAddress: string;
  let ownershipFacet: any;
  let ownershipFacetAddress: string;
  let masterWhitelistFacet: any;
  let whitelistFacetAddress: string;
  let facets: { name: string; address: string }[];
  let tx;
  let receipt;
  let result;
  const addresses: any[] = [];

  before(async function () {
    // Deploying the albDiamond
    ({
      diamondAddress,
      diamondInitAddress,
      diamondCutFacetAddress,
      diamondLoupeFacetAddress,
      ownershipFacetAddress,
      whitelistFacetAddress,
    } = await deployMasterDiamond());
    diamondCutFacet = await ethers.getContractAt('DiamondCutFacet', diamondAddress);
    diamondLoupeFacet = await ethers.getContractAt('DiamondLoupeFacet', diamondAddress);
    ownershipFacet = await ethers.getContractAt('OwnershipFacet', diamondAddress);
    masterWhitelistFacet = await ethers.getContractAt('WhiteListFacet', diamondAddress);
    await masterWhitelistFacet.addFacetToWhiteList(diamondInitAddress);
    await masterWhitelistFacet.addFacetToWhiteList(diamondCutFacetAddress);
    await masterWhitelistFacet.addFacetToWhiteList(diamondLoupeFacetAddress);
    await masterWhitelistFacet.addFacetToWhiteList(ownershipFacetAddress);
    await masterWhitelistFacet.addFacetToWhiteList(whitelistFacetAddress);
    facets = [
      { name: 'DiamondCutFacet', address: diamondCutFacetAddress },
      { name: 'DiamondInit', address: diamondInitAddress },
      { name: 'DiamondLoupeFacet', address: diamondLoupeFacetAddress },
      { name: 'OwnershipFacet', address: ownershipFacetAddress },
      { name: 'WhiteListFacet', address: whitelistFacetAddress },
    ];
  });

  it('[Should have four facets calling to facetAddresses function]', async () => {
    for (const address of await diamondLoupeFacet.facetAddresses()) {
      addresses.push(address);
    }

    assert.equal(addresses.length, 4);
  });

  it('facets should have the right function selectors -- call to facetFunctionSelectors function', async () => {
    let selectors = getSelectors(diamondCutFacet);
    result = await diamondLoupeFacet.facetFunctionSelectors(addresses[0]);
    assert.sameMembers(result, selectors);
    selectors = getSelectors(diamondLoupeFacet);
    result = await diamondLoupeFacet.facetFunctionSelectors(addresses[1]);
    assert.sameMembers(result, selectors);
    selectors = getSelectors(ownershipFacet);
    result = await diamondLoupeFacet.facetFunctionSelectors(addresses[2]);
    assert.sameMembers(result, selectors);
  });

  it('selectors should be associated to facets correctly -- multiple calls to facetAddress function', async () => {
    assert.equal(addresses[0], await diamondLoupeFacet.facetAddress('0x1f931c1c'));
    assert.equal(addresses[1], await diamondLoupeFacet.facetAddress('0xcdffacc6'));
    assert.equal(addresses[1], await diamondLoupeFacet.facetAddress('0x01ffc9a7'));
    assert.equal(addresses[2], await diamondLoupeFacet.facetAddress('0xf2fde38b'));
  });

  it('should add test1 functions', async () => {
    const Test1Facet = await ethers.getContractFactory('Test1Facet');
    const test1Facet = await Test1Facet.deploy();
    await test1Facet.deployed();
    addresses.push(test1Facet.address);
    const selectors = getSelectors(Test1Facet).remove(['supportsInterface(bytes4)']);
    tx = await diamondCutFacet.diamondCut(
      [
        {
          facetAddress: test1Facet.address,
          action: FacetCutAction.Add,
          functionSelectors: selectors,
        },
      ],
      ethers.constants.AddressZero,
      '0x',
      { gasLimit: 800000 }
    );
    receipt = await tx.wait();
    if (!receipt.status) {
      throw Error(`Diamond upgrade failed: ${tx.hash}`);
    }
    result = await diamondLoupeFacet.facetFunctionSelectors(test1Facet.address);
    assert.sameMembers(result, selectors);
  });

  it('should test function call', async () => {
    const test1Facet = await ethers.getContractAt('Test1Facet', diamondAddress);
    await test1Facet.test1Func10();
  });

  it('should replace supportsInterface function', async () => {
    const Test1Facet = await ethers.getContractFactory('Test1Facet');
    const selectors = getSelectors(Test1Facet).get(['supportsInterface(bytes4)']);
    const testFacetAddress = addresses[4];
    tx = await diamondCutFacet.diamondCut(
      [
        {
          facetAddress: testFacetAddress,
          action: FacetCutAction.Replace,
          functionSelectors: selectors,
        },
      ],
      ethers.constants.AddressZero,
      '0x',
      { gasLimit: 800000 }
    );
    receipt = await tx.wait();
    if (!receipt.status) {
      throw Error(`Diamond upgrade failed: ${tx.hash}`);
    }
    result = await diamondLoupeFacet.facetFunctionSelectors(testFacetAddress);
    assert.sameMembers(result, getSelectors(Test1Facet));
  });

  it('should add test2 functions', async () => {
    const Test2Facet = await ethers.getContractFactory('Test2Facet');
    const test2Facet = await Test2Facet.deploy();
    await test2Facet.deployed();
    addresses.push(test2Facet.address);
    const selectors = getSelectors(Test2Facet);
    tx = await diamondCutFacet.diamondCut(
      [
        {
          facetAddress: test2Facet.address,
          action: FacetCutAction.Add,
          functionSelectors: selectors,
        },
      ],
      ethers.constants.AddressZero,
      '0x',
      { gasLimit: 800000 }
    );
    receipt = await tx.wait();
    if (!receipt.status) {
      throw Error(`Diamond upgrade failed: ${tx.hash}`);
    }
    result = await diamondLoupeFacet.facetFunctionSelectors(test2Facet.address);
    assert.sameMembers(result, selectors);
  });

  it('should remove some test2 functions', async () => {
    const Test2Facet = await ethers.getContractFactory('Test2Facet');
    const functionsToKeep = ['test2Func1()', 'test2Func5()', 'test2Func6()', 'test2Func19()', 'test2Func20()'];
    const selectors = getSelectors(Test2Facet).remove(functionsToKeep);
    tx = await diamondCutFacet.diamondCut(
      [
        {
          facetAddress: ethers.constants.AddressZero,
          action: FacetCutAction.Remove,
          functionSelectors: selectors,
        },
      ],
      ethers.constants.AddressZero,
      '0x',
      { gasLimit: 800000 }
    );
    receipt = await tx.wait();
    if (!receipt.status) {
      throw Error(`Diamond upgrade failed: ${tx.hash}`);
    }
    result = await diamondLoupeFacet.facetFunctionSelectors(addresses[5]);
    assert.sameMembers(result, getSelectors(Test2Facet).get(functionsToKeep));
  });

  it('should remove some test1 functions', async () => {
    const Test1Facet = await ethers.getContractFactory('Test1Facet');
    const functionsToKeep = ['test1Func2()', 'test1Func11()', 'test1Func12()'];
    const selectors = getSelectors(Test1Facet).remove(functionsToKeep);
    tx = await diamondCutFacet.diamondCut(
      [
        {
          facetAddress: ethers.constants.AddressZero,
          action: FacetCutAction.Remove,
          functionSelectors: selectors,
        },
      ],
      ethers.constants.AddressZero,
      '0x',
      { gasLimit: 800000 }
    );
    receipt = await tx.wait();
    if (!receipt.status) {
      throw Error(`Diamond upgrade failed: ${tx.hash}`);
    }
    result = await diamondLoupeFacet.facetFunctionSelectors(addresses[4]);
    assert.sameMembers(result, getSelectors(Test1Facet).get(functionsToKeep));
  });

  it("remove all functions and facets accept 'diamondCut' and 'facets'", async () => {
    let selectors = [];
    let facets = await diamondLoupeFacet.facets();
    for (let i = 0; i < facets.length; i++) {
      selectors.push(...facets[i].functionSelectors);
    }
    selectors = removeSelectors(selectors, ['facets()', 'diamondCut(tuple(address,uint8,bytes4[])[],address,bytes)']);
    tx = await diamondCutFacet.diamondCut(
      [
        {
          facetAddress: ethers.constants.AddressZero,
          action: FacetCutAction.Remove,
          functionSelectors: selectors,
        },
      ],
      ethers.constants.AddressZero,
      '0x',
      { gasLimit: 800000 }
    );
    receipt = await tx.wait();
    if (!receipt.status) {
      throw Error(`Diamond upgrade failed: ${tx.hash}`);
    }
    facets = await diamondLoupeFacet.facets();
    assert.equal(facets.length, 2);
    assert.equal(facets[0][0], addresses[0]);
    assert.sameMembers(facets[0][1], ['0x1f931c1c']);
    assert.equal(facets[1][0], addresses[1]);
    assert.sameMembers(facets[1][1], ['0x7a0ed627']);
  });

  it('add most functions and facets', async () => {
    const diamondLoupeFacetSelectors = getSelectors(diamondLoupeFacet).remove(['supportsInterface(bytes4)']);
    const Test1Facet = await ethers.getContractFactory('Test1Facet');
    const Test2Facet = await ethers.getContractFactory('Test2Facet');
    // Any number of functions from any number of facets can be added/replaced/removed in a
    // single transaction
    const cut = [
      {
        facetAddress: addresses[1],
        action: FacetCutAction.Add,
        functionSelectors: diamondLoupeFacetSelectors.remove(['facets()']),
      },
      {
        facetAddress: addresses[2],
        action: FacetCutAction.Add,
        functionSelectors: getSelectors(ownershipFacet),
      },
      {
        facetAddress: addresses[3],
        action: FacetCutAction.Add,
        functionSelectors: getSelectors(masterWhitelistFacet),
      },
      {
        facetAddress: addresses[4],
        action: FacetCutAction.Add,
        functionSelectors: getSelectors(Test1Facet),
      },
      {
        facetAddress: addresses[5],
        action: FacetCutAction.Add,
        functionSelectors: getSelectors(Test2Facet),
      },
    ];
    tx = await diamondCutFacet.diamondCut(cut, ethers.constants.AddressZero, '0x', { gasLimit: 8000000 });
    receipt = await tx.wait();
    if (!receipt.status) {
      throw Error(`Diamond upgrade failed: ${tx.hash}`);
    }
    const facets = await diamondLoupeFacet.facets();
    const facetAddresses = await diamondLoupeFacet.facetAddresses();
    assert.equal(facetAddresses.length, 6);
    assert.equal(facets.length, 6);
    assert.sameMembers(facetAddresses, addresses);
    assert.equal(facets[0][0], facetAddresses[0], 'first facet');
    assert.equal(facets[1][0], facetAddresses[1], 'second facet');
    assert.equal(facets[2][0], facetAddresses[2], 'third facet');
    assert.equal(facets[3][0], facetAddresses[3], 'fourth facet');
    assert.equal(facets[4][0], facetAddresses[4], 'fifth facet');
    assert.sameMembers(facets[findAddressPositionInFacets(addresses[0], facets)!][1], getSelectors(diamondCutFacet));
    assert.sameMembers(facets[findAddressPositionInFacets(addresses[1], facets)!][1], diamondLoupeFacetSelectors);
    assert.sameMembers(facets[findAddressPositionInFacets(addresses[2], facets)!][1], getSelectors(ownershipFacet));
    assert.sameMembers(facets[findAddressPositionInFacets(addresses[4], facets)!][1], getSelectors(Test1Facet));
    assert.sameMembers(facets[findAddressPositionInFacets(addresses[5], facets)!][1], getSelectors(Test2Facet));
  });

  it('[Testing the facet Test1Facet should be the same address in the array]', async function () {
    const diamondLoupe = await ethers.getContractAt('DiamondLoupeFacet', diamondAddress);
    const Test1Facet = await ethers.getContractFactory('Test1Facet');
    const facetAddress = await diamondLoupe.facetAddress(getSelector(Test1Facet.interface.functions['test1Func1()']));
    assert.equal(addresses[4], facetAddress, 'First facet');
  });

  it('[Should deploy a new diamond thats not the master diamond]', async function () {
    const diamondTestAddress = await deployDiamond(diamondAddress, facets);
    const masterWhitelistTestFacet = await ethers.getContractAt('WhiteListFacet', diamondTestAddress);
    assert.equal(diamondAddress, await masterWhitelistTestFacet.masterDiamond());
  });

  it('[Should add a new whitelisted address to the list]', async function () {
    const diamondTestAddress = await deployDiamond(diamondAddress, facets);
    const diamondTestCutFacet = await ethers.getContractAt('DiamondCutFacet', diamondTestAddress);
    const diamondTestLoupeFacet = await ethers.getContractAt('DiamondLoupeFacet', diamondTestAddress);
    const Test1Facet = await ethers.getContractFactory('Test1Facet');
    const test1Facet = await Test1Facet.deploy();
    await test1Facet.deployed();

    // Adding the whitelisted address
    await masterWhitelistFacet.addFacetToWhiteList(test1Facet.address);
    const selectors = getSelectors(Test1Facet).remove(['supportsInterface(bytes4)']);
    tx = await diamondTestCutFacet.diamondCut(
      [
        {
          facetAddress: test1Facet.address,
          action: FacetCutAction.Add,
          functionSelectors: selectors,
        },
      ],
      ethers.constants.AddressZero,
      '0x',
      { gasLimit: 800000 }
    );
    receipt = await tx.wait();
    if (!receipt.status) {
      throw Error(`Diamond upgrade failed: ${tx.hash}`);
    }
    result = await diamondTestLoupeFacet.facetFunctionSelectors(test1Facet.address);
    assert.sameMembers(result, selectors);
  });
});
