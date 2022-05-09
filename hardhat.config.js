require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
	networks: {
		rinkeby: {
			url: process.env.NODE_API_URL,
			accounts: [process.env.RINKEBY_PRIVATE_KEY],
		}
	}
};
//if it's getting an error saying "There's one or more errors in your config file", remember the NODE_API_URL and RINKEBY_PRIVATE_KEY are stored in the .env file. Run 'source .env' to fiz. 
