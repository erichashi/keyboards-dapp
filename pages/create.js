import { useState, useEffect } from "react";
import { ethers  } from "ethers"; 
import Router from "next/router"; 

import metamaskAccountProvider from "../utils/meta-mask-account-provider"
import Keyboard from "../components/keyboard";
import PrimaryButton from "../components/primary-button";
import getKeyboardsContract from '../utils/getKeyboardsContract'
import abi from "../utils/Keyboards.json";
import getContractAddress from "../utils/contractAddress"

export default function Home() {
	

	// --------------- STATES  -------------------
	
	//utils/meta-mask-account-provider.js
	const { ethereum, connectedAccount, connectAccount  } = metamaskAccountProvider();
	
	//states to store the form values
	const [newKeyboardKind, setNewKeyboardKind] = useState(0);
	const [newKeyboardIsPBT, setNewKeyboardIsPBT] = useState(false);
	const [newKeyboardFilter, setNewKeyboardFilter] = useState("");

	//for loading buttons. see in the return, it changes the html
	const [mining, setMining] = useState(false);
	const [creating, setCreating] = useState(false);
	
	//the contract at the blockchain
	const keyboardsContract = getKeyboardsContract(ethereum);

	//contract address in utils/contractAddress.js
	const contractAddress =	getContractAddress();
	//ABI (Application Binary Interface) tells the app whats functions can be called. 
	//you can see it in artifacts/contracts/Keyboards.sol/Keyboards.json
	const contractABI = abi.abi;


	// ------------------ FUNCTIONS----------------------
	// handle keyboard creating submition 
	const submitCreate = async (e) => {
		e.preventDefault();

		if (!ethereum) {
		  console.error('Ethereum object is required to create a keyboard');
		  return;
		}

		setCreating(true);

		try {
			//calls function create() at the contract
			const createTxn = await keyboardsContract.create(newKeyboardKind, newKeyboardIsPBT, newKeyboardFilter);
			console.log('Create transaction started...', createTxn.hash);

			setCreating(false);
			setMining(true);

			await createTxn.wait();
			console.log('Created keyboard!', createTxn.hash);

			Router.push('/');

		} finally {
			setMining(false);
		}

	}


	// --------------- RETURNS  -------------------
	
	if (!ethereum) return <p>Please install MetaMask to connect to this site</p> 
	if (!connectedAccount) return <PrimaryButton onClick={connectAccount}>Connect MetaMask Wallet</PrimaryButton>

	return (
	  <div className="flex flex-col gap-y-8">


		<form className="flex flex-col gap-y-2">

			<div>
				<label htmlFor="keyboard-kind" className="block text-sm font-medium text-gray-700">
					Keyboard Kind
				</label>
			</div>
			<select 
				id="keyboard-kind"
				name="keyboard-kind"
				value={newKeyboardKind} 
				className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
				onChange={(e) => {setNewKeyboardKind(e.target.value)}} 
			>
				<option value='0'>60%</option>
				<option value='1'>75%</option>
				<option value='2'>80%</option>
				<option value='3'>Iso-105</option>
			</select>


			
			<div>
				<label htmlFor="keyboard-keycap" className="block text-sm font-medium text-gray-700">
					Keycap Type
				</label>
			</div>
			<select 
				id="keyboard-keycap"
				name="keyboard-keycap"
				className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
				value={newKeyboardIsPBT ? "PBT" : "ABS"} 
				onChange={(e) => {setNewKeyboardIsPBT(e.target.value === "PBT")}} >
				<option value='PBT'>PBT (darker)</option>
				<option value='ABS'>ABS (lighter)</option>
			</select>



			  <div>
				<label htmlFor="keyboard-filter" className="block text-sm font-medium text-gray-700">
				  Keyboard Filter
				</label>
			  </div>
			  <input
				id="keyboard-filter"
				name="keyboard-filter"
				className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
				value={newKeyboardFilter}
				onChange={(e) => { setNewKeyboardFilter(e.target.value) }} />




			  <PrimaryButton type="submit" disabled={mining} onClick={submitCreate}>
				{ (!mining && !creating) ? "Create Keyboard" :
					( (creating) ? 
						<span>
							<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24"></svg>Creating
						</span> : 
						<span>
							<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24"></svg>Mining
						</span> )} 
			  </PrimaryButton>

		</form>

		<div>
			<h2 className="block text-lg font-medium text-gray-700">Preview</h2>
			 <Keyboard kind={newKeyboardKind} isPBT={newKeyboardIsPBT} filter={newKeyboardFilter} />
		</div>


		<p>Connected account:{connectedAccount} </p>

	  </div>
	)

}

