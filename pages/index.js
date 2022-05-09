import { useState, useEffect } from "react";
import { ethers  } from "ethers"; 
import { toast } from "react-hot-toast"
import { UserCircleIcon } from "@heroicons/react/solid"

import metamaskAccountProvider from "../utils/meta-mask-account-provider"
import Keyboard from "../components/keyboard";
import TipButton from "../components/tip-button";
import PrimaryButton from "../components/primary-button";
import getKeyboardsContract from '../utils/getKeyboardsContract'
import abi from "../utils/Keyboards.json";
import getContractAddress from "../utils/contractAddress"


export default function Home() {
	
	// --------------- STATES  -------------------
	
	//utils/meta-mask-account-provider.js
	const { ethereum, connectedAccount, connectAccount  } = metamaskAccountProvider();

	//variable to list keyboards
	const [keyboards, setKeyboards] = useState([]);

	//loading state, fetching from the blockchain
	const [keyboardsLoading, setKeyboardsLoading] = useState(false);
	
	//the contract at the blockchain
	const keyboardsContract = getKeyboardsContract(ethereum);
	
	//contract address in utils/contractAddress.js
	const contractAddress =	getContractAddress();
	
	//ABI (Application Binary Interface) tells the app whats functions can be called. 
	//you can see it in artifacts/contracts/Keyboards.sol/Keyboards.json
	const contractABI = abi.abi;


	// -------------- FUNCTIONS	---------------
	
	// get the keyboards from the contract at the bc
	const getKeyboards = async () => {
		if (ethereum && connectedAccount) {
			setKeyboardsLoading(true);
			try {
				//call getKeyboards() at the contract
				const keyboards = await keyboardsContract.getKeyboards();
			    console.log('Retrieved keyboards...', keyboards);
				setKeyboards(keyboards);
			} finally {
				setKeyboardsLoading(false);
			}
		}
	}
	//we use !! to make sure we have the contract before running	
	useEffect(() => getKeyboards(), [!!keyboardsContract, connectedAccount]);

	// --------------------- utils ------------------
	
	// compare two addresses and return if they are equal
	function addressesEqual(add1, add2){
		if(!add1 || !add2) return false;

		return add1.toUpperCase() === add2.toUpperCase();
	}

	//constract event listeners , show a toast (notification)
	const addContractEventHandlers = () => {
		if (keyboardsContract && connectedAccount) {

			//.on to call the event we created in solidity
			
			//call KeyboardCreated from the contract
			keyboardsContract.on('KeyboardCreated', async (keyboard) => {
				if (connectedAccount && !addressesEqual(keyboard.owner, connectedAccount)) {
					toast('Somebody created a new keyboard!', { id: JSON.stringify(keyboard) })
				}
				await getKeyboards();
			})

			//call TipSent from the contract
			keyboardsContract.on('TipSent', async (owner, tipVal) => {
				if (addressesEqual(owner, connectedAccount)) {

					toast('Somebody sent you a ' + ethers.utils.formatEther(tipVal) + ' eth tip!', { id: owner + tipVal })
				}
				await getKeyboards();
			})
		}
	  }

	  useEffect(addContractEventHandlers, [!!keyboardsContract, connectedAccount]);



	// --------------- RETURNS  -------------------
	if (!ethereum) return <p>Please install MetaMask to connect to this site</p> 
	if (!connectedAccount) return <PrimaryButton onClick={connectAccount}>Connect MetaMask Wallet </PrimaryButton>



	if (keyboards.length > 0) {
		return (
		  <div className="flex flex-col gap-4">
			<PrimaryButton type="link" href="/create">Create a Keyboard!</PrimaryButton>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
			  {keyboards.map(
				([kind, isPBT, filter, owner], i) => (
					<div key={i} className="relative">
						  <Keyboard kind={kind} isPBT={isPBT} filter={filter} />
						  <span className="absolute top-1 right-6">
							{addressesEqual(owner, connectedAccount) ?
							  <UserCircleIcon className="h-5 w-5 text-indigo-100" /> : <TipButton keyboardsContract={keyboardsContract} index={i}/>
							}
						  </span>
					</div>
				)
			  )}
			</div>
			<p>Connected account:{connectedAccount} </p>
		  </div>
		 )
	}

	if (keyboardsLoading) {
	  return (
		<div className="flex flex-col gap-4">
		  <PrimaryButton type="link" href="/create">Create a Keyboard!</PrimaryButton>
		  <p>Loading Keyboards...</p>


		  <p>Connected account:{connectedAccount} </p>


		</div>
	  )
	}

	// No keyboards yet
	return (
	<div className="flex flex-col gap-4">
	  <PrimaryButton type="link" href="/create">Create a Keyboard!</PrimaryButton>
	  <p>No keyboards yet!</p>


	  <p>Connected account:{connectedAccount} </p>

	</div>
	)
}

