import { ethers } from "ethers";
import {
  GelatoRelayAdapter,
  MetaTransactionOptions,
} from "@safe-global/relay-kit";
import Safe from "@safe-global/safe-core-sdk";
import EthersAdapter from "@safe-global/safe-ethers-lib";
import useAuthKit from "./useAuthKit";
import { OperationType } from "@safe-global/safe-core-sdk-types";


// TODO: make this function dynamic to accept any safe address and chainId
const useRelayKit = () => {
  const { safeAuth } = useAuthKit();

  const withdrawAmount = ethers.utils.parseUnits("0.001", "ether").toString();

  const safeAddress = "0xCB8eC99b9647c23C0F52D30f320bBf60a33D08B6"
  const chainId = 5;

  const gasLimit = "10000000";

  const startRelay = async () => {
    // Create a transaction object
    const safeTransactionData = {
      to: "0x30F99aa3239E795BfE8037F42be9feA16071eCa9",
      data: "0x", // leave blank for ETH transfers
      value: withdrawAmount,
      operation: OperationType.Call,
    };
    const options = {
      gasLimit: ethers.BigNumber.from(gasLimit),
      isSponsored: true,
    };
    await safeAuth.signIn();
    const ethProvider = new ethers.providers.Web3Provider(
      await safeAuth.getProvider()
    );

    const signer = ethProvider.getSigner();

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer,
    });

    const safeSDK = await Safe.create({
      ethAdapter,
      safeAddress,
    });

    const relayAdapter = new GelatoRelayAdapter(
      process.env.NEXT_PUBLIC_GELATO_RELAY_API_KEY
    );

    const safeTransaction = await safeSDK.createTransaction({
      safeTransactionData,
    });

    const signedSafeTx = await safeSDK.signTransaction(safeTransaction);

    const encodedTx = safeSDK
      .getContractManager()
      .safeContract.encode("execTransaction", [
        signedSafeTx.data.to,
        signedSafeTx.data.value,
        signedSafeTx.data.data,
        signedSafeTx.data.operation,
        signedSafeTx.data.safeTxGas,
        signedSafeTx.data.baseGas,
        signedSafeTx.data.gasPrice,
        signedSafeTx.data.gasToken,
        signedSafeTx.data.refundReceiver,
        signedSafeTx.encodedSignatures(),
      ]);

    const relayTransaction = {
      target: safeAddress,
      encodedTransaction: encodedTx,
      chainId,
      options,
    };

    console.log(relayTransaction);
    const response = await relayAdapter.relayTransaction(relayTransaction);

    console.log(
      `Relay Transaction Task ID: https://relay.gelato.digital/tasks/status/${response.taskId}`
    );
  };
  return { startRelay };
};

export default useRelayKit;
