import { ethers } from "ethers";
import {
  AxelarQueryAPI,
  Environment,
  CHAINS,
  AxelarGMPRecoveryAPI,
  GMPStatus,
  GasPaidStatus,
} from "@axelar-network/axelarjs-sdk";
import useAuthKit from "./useAuthKit";

import usdcAbi from "../abis/axelar/usdc.json";
import celoAbi from "../abis/axelar/celo.json";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
//import ethAbi from "../abis/axelar/eth.json";

const CELO_USDC_ADDRESS = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";
const CELO_CONTRACT_ADDRESS = "0x24985149040856736f3a65baadbb87ea43aa96f8";
//const ETH_USDC_ADDRESS = "0x220BdcCa5adA47b0c7d2723355161611411Bd834";
const ETH_CONTRACT_ADDRESS = "0x0aC2C6391264Fb640266567E17F1A6fE4242e1D5";
const api = new AxelarQueryAPI({ environment: Environment.TESTNET });
const sdk = new AxelarGMPRecoveryAPI({
  environment: Environment.TESTNET,
});
async function waitForTransaction(provider, txnHash) {
  let receipt = await provider.waitForTransaction(txnHash, 1);

  return receipt;
}

const useAxelar = () => {
  const safeAuth = useContext(AuthContext);
  const { switchChain } = useAuthKit();

  async function execute({ amount, receiver }) {
    await safeAuth.signIn();
    await switchChain("alfajores");

    let provider = new ethers.providers.Web3Provider(
      await safeAuth.getProvider()
    );

    let signer = provider.getSigner();

    // initialize contracts using address and ABI
    const celoUSDC = new ethers.Contract(CELO_USDC_ADDRESS, usdcAbi, signer);

    const celoContract = new ethers.Contract(
      CELO_CONTRACT_ADDRESS,
      celoAbi,
      signer
    );

    // set the recipient address
    //const receiver = await signer.getAddress();

    // STEP 1: Allow the CELO contract to spend USDC on your behalf
    const celoUSDCWithSigner = celoUSDC.connect(signer);
    const approveTx = await celoUSDCWithSigner.approve(
      CELO_CONTRACT_ADDRESS,
      amount
    );
    const approveTxReceipt = await waitForTransaction(provider, approveTx.hash);
    console.log("ApproveTxReceipt: ", approveTxReceipt);

    // STEP 2: Call the CELO contract to send USDC to the Axelar network
    const fee = await api.estimateGasFee(
      CHAINS.TESTNET.CELO,
      CHAINS.TESTNET.ETHEREUM,
      "aUSDC"
    );
    console.log("Fee: ", fee);

    const celoContractWithSigner = celoContract.connect(signer);
    const sendTx = await celoContractWithSigner.send(
      ETH_CONTRACT_ADDRESS,
      receiver,
      amount,
      {
        value: fee,
      }
    );
    const sendTxReceipt = await waitForTransaction(provider, sendTx.hash);
    console.log("SendTxReceipt: ", sendTxReceipt);

    // STEP 3: Query the Axelar network for the transaction status
    console.log(
      "View Status At: https://testnet.axelarscan.io/gmp/" + sendTx.hash
    );
    let txStatus = await sdk.queryTransactionStatus(sendTx.hash);
    while (txStatus.status !== GMPStatus.DEST_EXECUTED) {
      console.log(
        "Tx Status: ",
        txStatus.status,
        "\nGas Status: ",
        txStatus.gasPaidInfo?.status ?? GasPaidStatus.GAS_UNPAID
      );
      txStatus = await sdk.queryTransactionStatus(sendTx.hash);
      if (txStatus.error) {
        console.error("Error: ", txStatus.error);
        break;
      }
    }
    console.log(
      "Tx Status: ",
      txStatus.status,
      "\nGas Status: ",
      txStatus.gasPaidInfo?.status ?? GasPaidStatus.GAS_UNPAID
    );
    console.log(
      "Bidging Completed: https://goerli.etherscan.io/tx/" +
        txStatus.executed.transactionHash
    );
  }

  return { execute };
};

export default useAxelar;
