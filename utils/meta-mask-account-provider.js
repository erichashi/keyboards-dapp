import { useState, useEffect } from "react";


// standard functions to connect the user to his/her metamask

export default function metamaskAccountProvider() {

	// React docs https://reactjs.org/docs/hooks-state.html
	// useState declares a "state variable". initially, the value we declared is undefined, and we'll set it with setValue() function.

	// 'ethereum', after being set by MetaMask, is an object that allows us to call functions on MetaMask and on the ethereum blockchain
	 const [ethereum, setEthereum] = useState(undefined);
	//current user
	const [connectedAccount, setConnectedAccount] = useState(undefined);
  


	// -------------- FUNCTIONS	---------------------
	
	//check if metamask is installed, and if so, 
	//set the ethereum state to it
	//also check if the connected chain is Rinkeby
	const setEthereumFromWindow = async () => {

		if(window.ethereum) {
			// Reload if chain changes, see <https://docs.metamask.io/guide/ethereum-provider.html#chainchanged>
			window.ethereum.on('chainChanged', (_chainId) => window.location.reload());
			const chainId = await window.ethereum.request({ method: 'eth_chainId' });
			const rinkebyId = '0x4'; // See <https://docs.metamask.io/guide/ethereum-provider.html#chain-ids>
			if(chainId === rinkebyId) {
				setEthereum(window.ethereum);
			} else {
				alert('Please use Rinkeby network');
			}
		}
	}
	//run when the page is loaded: function will run on the client side
	useEffect(() => setEthereumFromWindow(), [])



	//given an account, set the state connectedAccount to it
	//if account is invalid, no set
	const handleAccounts = (accounts) => {
		if (accounts.length > 0) {
			const account = accounts[0];
			console.log('We have an authorized account: ', account);
			setConnectedAccount(account);
		} else {
			console.log("No authorized accounts yet")
		}
	};


	//check if the metamask has accounts. if so, get the account from it 
	const getConnectedAccount = async () => {
		if (ethereum) {
			//request the accounts directly to MetaMask
			const accounts = await ethereum.request({ method: 'eth_accounts' });
			handleAccounts(accounts);
		}
	};
	useEffect(() => getConnectedAccount());


	//function that login the user. a button triggers it
	const connectAccount = async () => {
		if (!ethereum) {
			console.error('Ethereum object is required to connect an account');
			return;
		}
		const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
		handleAccounts(accounts);
	};
  
	//returns the ethereum object, the user and the function
	return {ethereum, connectedAccount, connectAccount};

}

