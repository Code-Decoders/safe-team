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
import fvmAbi from "../abis/axelar/fvm.json";
import ethAbi from "../abis/axelar/eth.json";

const FVM_USDC_ADDRESS = "0x40721AE051B1D20c12038d7c408454B3Ca310Ea1";
const FVM_CONTRACT_ADDRESS = "0xb7ff4e2dbe970f94ca08083db9cb073266e3c357";
const ETH_USDC_ADDRESS = "0x220BdcCa5adA47b0c7d2723355161611411Bd834";
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
  const { safeAuth, switchChain } = useAuthKit();

  async function execute({amount, reciever}) {
    await safeAuth.signIn();
    await switchChain("avalanche");

    let provider = new ethers.providers.Web3Provider(
      await safeAuth.getProvider()
    );

    let signer = provider.getSigner();

    // initialize contracts using address and ABI
    const fvmUSDC = new ethers.Contract(FVM_USDC_ADDRESS, usdcAbi, signer);

    const fvmContract = new ethers.Contract(
      FVM_CONTRACT_ADDRESS,
      fvmAbi,
      signer
    );

    // set the recipient address
    //const reciever = await signer.getAddress();


    // STEP 1: Allow the FVM contract to spend USDC on your behalf
    const fvmUSDCWithSigner = fvmUSDC.connect(signer);
    const approveTx = await fvmUSDCWithSigner.approve(
      FVM_CONTRACT_ADDRESS,
      amount
    );
    const approveTxReceipt = await waitForTransaction(provider, approveTx.hash);
    console.log("ApproveTxReceipt: ", approveTxReceipt);

    // STEP 2: Call the FVM contract to send USDC to the Axelar network
    const fee = await api.estimateGasFee(
      CHAINS.TESTNET["FILECOIN"],
      CHAINS.TESTNET["ETHEREUM"],
      "aUSDC",
      undefined,
      1.1
    );
    console.log("Fee: ", fee);

    const fvmContractWithSigner = fvmContract.connect(signer);
    const sendTx = await fvmContractWithSigner.send(
      ETH_CONTRACT_ADDRESS,
      reciever,
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
  };

  return { execute };
};

export default useAxelar;
