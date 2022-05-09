import { ethers } from "ethers";

import abi from "../utils/Keyboards.json"
import getContractAddress from "../utils/contractAddress"

const contractAddress = getContractAddress();
const contractABI = abi.abi;

//return the contract located at the address contractAddress at the bc
export default function getKeyboardsContract(ethereum) {
  if(ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
  } else {
    return undefined;
  }
}

