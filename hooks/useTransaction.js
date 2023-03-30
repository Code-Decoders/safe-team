import { ethers } from "ethers";
import {
  GelatoRelayAdapter,
  MetaTransactionOptions,
} from "@safe-global/relay-kit";
import Safe from "@safe-global/safe-core-sdk";
import SafeSignature from "@safe-global/safe-core-sdk/dist/src/utils/signatures/SafeSignature";
import EthersAdapter from "@safe-global/safe-ethers-lib";
import useAuthKit from "./useAuthKit";
import { OperationType } from "@safe-global/safe-core-sdk-types";
import SafeServiceClient from "@safe-global/safe-service-client";

const useTransaction = () => {
  const { safeAuth } = useAuthKit();

  const relayAdapter = new GelatoRelayAdapter(
    process.env.NEXT_PUBLIC_GELATO_RELAY_API_KEY
  );

  const withdrawAmount = ethers.utils.parseUnits("0.0005", "ether").toString();

  const safeAddress = "0xCB8eC99b9647c23C0F52D30f320bBf60a33D08B6";
  const chainId = 5;
  const txServiceUrl = "https://safe-transaction-goerli.safe.global";
  const gasLimit = "3000000";

  const options = {
    gasLimit: ethers.BigNumber.from(gasLimit),
    isSponsored: true,
  };

  const getPendingTransactions = async () => {
    const eoaresp = await safeAuth.signIn();

    const ethProvider = new ethers.providers.Web3Provider(
      await safeAuth.getProvider()
    );

    const signer = ethProvider.getSigner();

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer,
    });
    const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter });

    const safeSDK = await Safe.create({
      ethAdapter,
      safeAddress,
    });

    return await safeService.getPendingTransactions(safeAddress);
  };

  const approveTransaction = async (hash) => {
    const eoaresp = await safeAuth.signIn();

    const ethProvider = new ethers.providers.Web3Provider(
      await safeAuth.getProvider()
    );

    const signer = ethProvider.getSigner();

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer,
    });
    const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter });

    const safeSDK = await Safe.create({
      ethAdapter,
      safeAddress,
    });

    let signature = await safeSDK.signTransactionHash(hash);
    safeService.confirmTransaction(hash, signature.data).then(console.log);

    const pdtxs = await safeService.getPendingTransactions(safeAddress);
    console.log(
      pdtxs.results[0].confirmations.length,
      pdtxs.results[0].confirmationsRequired
    );
    if (
      pdtxs.results[0].confirmations.length >=
      pdtxs.results[0].confirmationsRequired
    ) {
      const safeRawTx = await safeService.getTransaction(hash);

      const signedSafeTx = await toSafeTransactionType(safeRawTx, safeSDK);

      console.log(signedSafeTx);
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
      console.log(encodedTx);
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
    }
  };

  const rejectTransaction = async (hash) => {
    const eoaresp = await safeAuth.signIn();

    const ethProvider = new ethers.providers.Web3Provider(
      await safeAuth.getProvider()
    );

    const signer = ethProvider.getSigner();

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer,
    });
    const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter });

    const safeSDK = await Safe.create({
      ethAdapter,
      safeAddress,
    });

    const tx = await safeService.getTransaction(hash)

    const safeTx = await safeSDK.createRejectionTransaction(tx.nonce);
    const signature = await safeSDK.signTransactionHash(safeTx.safeTxHash);
  }

  const proposeTransaction = async (safeTransactionData) => {
    const eoaresp = await safeAuth.signIn();

    const ethProvider = new ethers.providers.Web3Provider(
      await safeAuth.getProvider()
    );

    const signer = ethProvider.getSigner();

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer,
    });
    const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter });

    const safeSDK = await Safe.create({
      ethAdapter,
      safeAddress,
    });

    safeService.getPendingTransactions(safeAddress).then((res) => {
      console.log(res);
    });

    const safeTransaction = await safeSDK.createTransaction({
      safeTransactionData,
      // nonce is error is there
    });

    const safeTxHash = await safeSDK.getTransactionHash(safeTransaction);

    const signedSafeTx = await safeSDK.signTransactionHash(safeTxHash);

    console.log({
      safeAddress,
      safeTransactionData: safeTransaction.data,
      safeTxHash,
      senderAddress: eoaresp.eoa,
      senderSignature: signedSafeTx.data,
      origin: "SafeTeam",
    });

    await safeService.proposeTransaction({
      safeAddress,
      safeTransactionData: safeTransaction.data,
      safeTxHash,
      senderAddress: eoaresp.eoa,
      senderSignature: signedSafeTx.data,
      origin: "SafeTeam",
    });
    console.log("Proposed");
  };

  const toSafeTransactionType = async (serviceTransactionResponse, sdk) => {
    const safeTransactionData = {
      to: serviceTransactionResponse.to,
      value: serviceTransactionResponse.value,
      data: serviceTransactionResponse.data || "0x",
      operation: serviceTransactionResponse.operation,
      safeTxGas: serviceTransactionResponse.safeTxGas,
      baseGas: serviceTransactionResponse.baseGas,
      gasPrice: Number(serviceTransactionResponse.gasPrice),
      gasToken: serviceTransactionResponse.gasToken,
      refundReceiver: serviceTransactionResponse.refundReceiver,
      nonce: serviceTransactionResponse.nonce,
    };
    const safeTransaction = await sdk.createTransaction({
      safeTransactionData,
    });
    serviceTransactionResponse.confirmations?.map((confirmation) => {
      console.log(confirmation);
      const signature = new SafeSignature(
        confirmation.owner,
        confirmation.signature
      );
      safeTransaction.addSignature(signature);
    });
    return safeTransaction;
  };
  return {
    proposeTransaction,
    getPendingTransactions,
    approveTransaction,
    rejectTransaction,
  };
};

export default useTransaction;
