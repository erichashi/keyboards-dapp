async function main() {
	const [owner, sboElse] = await hre.ethers.getSigners();
	
	const keyboardsContractFactory = await hre.ethers.getContractFactory("Keyboards");
	const keyboardsContract = await keyboardsContractFactory.deploy();
	await keyboardsContract.deployed();

	const keyboardTxn1 = await keyboardsContract.create(0, true, "sepia");
	await keyboardTxn1.wait();

	const keyboardTxn2 = await keyboardsContract.connect(sboElse).create(1, false, "grayscale");
	await keyboardTxn2.wait();

	keyboards = await keyboardsContract.getKeyboards();
	// console.log("We got the keyboards!", keyboards);

	//get the balance of the other user
	const balanceBefore = await hre.ethers.provider.getBalance(sboElse.address);
	console.log("somebodyElse balance before!", hre.ethers.utils.formatEther(balanceBefore));

	//give the other user a 1000 ether tip
	//function parseEther(x) returns x ethers in wei, which is the std unit of payments
	const tipTxn = await keyboardsContract.tip(1, {value: hre.ethers.utils.parseEther("1000")}); // tip the 2nd keyboard as owner!
	await tipTxn.wait();

	const balanceAfter = await hre.ethers.provider.getBalance(sboElse.address);
	console.log("somebodyElse balance after!", hre.ethers.utils.formatEther(balanceAfter));


}




// main function for the first part of the course
//async function main() {
////	const [owner, sboElse] = await hre.ethers.getSigners(); //signers are ethereum accounts
	
//	const keyboardsContractFactory = await hre.ethers.getContractFactory("Keyboards");
//	// hrs is auto imported by hardhat
	
//	const keyboardsContract = await keyboardsContractFactory.deploy();
//	await keyboardsContract.deployed();

//	console.log("Contract deployed to:", keyboardsContract.address);

//	const newKB = await keyboardsContract.create("new cool keyboard");
//	await newKB.wait();
//	//when we called create, it returns a transaction. we call await to wait for it to be mined.
	
//	let keyboards = await keyboardsContract.getKeyboards();
//	console.log("We got the keyboards!", keyboards);


//	const otherKB = await keyboardsContract.connect(sboElse).create("other hancy keyboard");
//	await otherKB.wait();

//	keyboards = await keyboardsContract.connect(sboElse).getKeyboards();
//	//both users can request the functions
//	console.log("Some new keyboards!", keyboards);


//	// npx hardhat run start.js
//}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
	console.error(error);
	process.exit(1);
});

