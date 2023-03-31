import { ethers } from "ethers";
import { parseUnits } from "ethers/lib/utils";

const abi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)",
];

const address = "0x81aC77864c5962482cB6E743A2ddecDee8120823";

const generateERC20Tx = async (to, amount, signer) => {
  const contract = new ethers.Contract(address, abi, signer);
  const txData = await contract.populateTransaction.transfer(
    to,
    parseUnits(amount)
  );
  return txData;
};

const getBalance = async (signer, _address) => {
    const contract = new ethers.Contract(address, abi, signer);
    const balance = await contract.balanceOf(_address);
    return balance;
}

export { generateERC20Tx, getBalance };