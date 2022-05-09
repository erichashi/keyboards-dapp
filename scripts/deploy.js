// file to deploy the contract to the real blockchay

// run npx hardhat run scripts/deploy.js --network NETWORKNAME 
// NETWORKNAME is rinkeby, in our case.

// note: every time we run this, a new contract is mined to the blockchain. So, remember to update the contractAddress and the contractABI at pages/index.js 
// rm utils/Keyboards.json
// cp artifacts/contracts/Keyboards.sol/Keyboards.json utils/


//update the contract address at utils/contractAddress.js

//there is a .env file storing the private key

async function main() {
  const keyboardsContractFactory = await hre.ethers.getContractFactory("Keyboards");
  const keyboardsContract = await keyboardsContractFactory.deploy();
  await keyboardsContract.deployed();

  console.log("The keyboards contract is deployed!", keyboardsContract.address)

  const keyboards = await keyboardsContract.getKeyboards();
  console.log("We got the keyboards!", keyboards);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

