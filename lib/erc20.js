import { ethers } from "ethers";
import { parseUnits } from "ethers/lib/utils";

const abi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)",
];

const address = "0x466595626333c55fa7d7ad6265d46ba5fdbbdd99";

const generateERC20Tx = async (to, amount, signer) => {
  const contract = new ethers.Contract(address, abi, signer);
  const txData = await contract.populateTransaction.transfer(
    to,
    parseUnits(amount)
  );
  return txData;
};

export default generateERC20Tx;