import React from "react";
import { ethers } from "ethers";

import useAuthKit from "./useAuthKit";
import tokenMessengerAbi from "../abis/cctp/TokenMessenger.json";
import messageAbi from "../abis/cctp/Message.json";
import usdcAbi from "../abis/Usdc.json";
import messageTransmitterAbi from "../abis/cctp/MessageTransmitter.json";

const AVAX_TOKEN_MESSENGER_CONTRACT_ADDRESS =
  "0xeb08f243e5d3fcff26a9e38ae5520a669f4019d0";
const USDC_AVAX_CONTRACT_ADDRESS = "0x5425890298aed601595a70ab815c96711a31bc65";
const AVAX_MESSAGE_CONTRACT_ADDRESS =
  "0x8025A4cb3933BB88AB104629F8d24c0EA6385087";
const ETH_MESSAGE_TRANSMITTER_CONTRACT_ADDRESS =
  "0x26413e8157cd32011e726065a5462e97dd4d03d9";

async function waitForTransaction(provider, txnHash, options) {
  const blocksToWait =
    options && options.blocksToWait ? options.blocksToWait : 1;

  let receipt = await provider.waitForTransaction(txnHash, blocksToWait);

  return receipt;
}

const useCCTP = () => {
  const { safeAuth, switchChain } = useAuthKit();

  async function executeTransfer({ destionationAddress, amount }) {
    await safeAuth.signIn();
    await switchChain("avalanche");

    let provider = new ethers.providers.Web3Provider(
      await safeAuth.getProvider()
    );

    let signer = provider.getSigner();
    // initialize contracts using address and ABI
    const avaxTokenMessengerContract = new ethers.Contract(
      AVAX_TOKEN_MESSENGER_CONTRACT_ADDRESS,
      tokenMessengerAbi,
      signer
    );
    const usdcAvaxContract = new ethers.Contract(
      USDC_AVAX_CONTRACT_ADDRESS,
      usdcAbi,
      signer
    );
    const avaxMessageContract = new ethers.Contract(
      AVAX_MESSAGE_CONTRACT_ADDRESS,
      messageAbi,
      signer
    );

    // EGTH destination address
    const destinationAddressInBytes32 =
      await avaxMessageContract.addressToBytes32(destionationAddress);
    const ETH_DESTINATION_DOMAIN = 0;

    // STEP 1: Approve messenger contract to withdraw from our active AVAX address
    const usdcAvaxContractWithSigner = usdcAvaxContract.connect(signer);
    const approveTx = await usdcAvaxContractWithSigner.approve(
      AVAX_TOKEN_MESSENGER_CONTRACT_ADDRESS,
      amount
    );
    const approveTxReceipt = await waitForTransaction(provider, approveTx.hash);
    console.log("ApproveTxReceipt: ", approveTxReceipt);

    // STEP 2: Burn USDC
    const avaxTokenMessengerContractWithSigner =
      avaxTokenMessengerContract.connect(signer);
    const burnTx = await avaxTokenMessengerContractWithSigner.depositForBurn(
      amount,
      ETH_DESTINATION_DOMAIN,
      destinationAddressInBytes32,
      USDC_AVAX_CONTRACT_ADDRESS
    );

    const burnTxReceipt = await waitForTransaction(provider, burnTx.hash);
    console.log("BurnTxReceipt: ", burnTxReceipt);

    // STEP 3: Retrieve message bytes from logs
    const transactionReceipt = await provider.getTransactionReceipt(
      burnTxReceipt.transactionHash
    );
    const eventTopic = ethers.utils.keccak256(
      ethers.utils.toUtf8Bytes("MessageSent(bytes)")
    );
    const log = transactionReceipt.logs.find((l) => l.topics[0] === eventTopic);
    const messageBytes = ethers.utils.defaultAbiCoder.decode(
      ["bytes"],
      log.data
    )[0];
    const messageHash = ethers.utils.keccak256(messageBytes);

    console.log(`MessageBytes: ${messageBytes}`);
    console.log(`MessageHash: ${messageHash}`);
    console.log(
      `Attestation Generated at: https://iris-api-sandbox.circle.com/attestations/${messageHash}`
    );

    // STEP 4: Fetch attestation signature
    let attestationResponse = { status: "pending" };
    while (attestationResponse.status != "complete") {
      const response = await fetch(
        `https://iris-api-sandbox.circle.com/attestations/${messageHash}`
      );
      attestationResponse = await response.json();
      await new Promise((r) => setTimeout(r, 2000));
    }

    const attestationSignature = attestationResponse.attestation;
    console.log(`Signature: ${attestationSignature}`);

    // STEP 5: Using the message bytes and signature recieve the funds on destination chain and address

    await switchChain("goerli");

    provider = new ethers.providers.Web3Provider(await safeAuth.getProvider());

    signer = provider.getSigner();

    const ethMessageTransmitterContract = new ethers.Contract(
      ETH_MESSAGE_TRANSMITTER_CONTRACT_ADDRESS,
      messageTransmitterAbi,
      signer
    );

    const receiveTxGasEstimate =
      await ethMessageTransmitterContract.estimateGas.receiveMessage(
        messageBytes,
        attestationSignature
      );

    const receiveTx = await ethMessageTransmitterContract.receiveMessage(
      messageBytes,
      attestationSignature,
      {
        gasLimit: receiveTxGasEstimate,
      }
    );
    const receiveTxReceipt = await waitForTransaction(provider, receiveTx.hash);
    console.log("ReceiveTxReceipt: ", receiveTxReceipt);
  }
  return { executeTransfer };
};

export default useCCTP;
