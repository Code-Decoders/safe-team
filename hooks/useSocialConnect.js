import FA_CONTRACT from "../abis/socialconnect/FederatedAttestations.json";
import ACCOUNTS_CONTRACT from "../abis/socialconnect/Accounts.json";

const ALFAJORES_RPC = "https://alfajores-forno.celo-testnet.org";
const FA_PROXY_ADDRESS = "0x70F9314aF173c246669cFb0EEe79F9Cfd9C34ee3";
const ACCOUNTS_PROXY_ADDRESS = "0xed7f51A34B4e71fbE69B3091FcF879cD14bD73A9";

import { OdisUtils } from "@celo/identity";
import { ethers } from "ethers";
import {
  AuthenticationMethod,
  OdisContextName,
} from "@celo/identity/lib/odis/query";
import WebBlsBlindingClient from "../components/bls-blinding-client";

const ISSUER_PRIVATE_KEY = process.env.NEXT_PUBLIC_ISSUER_PRIVATE_KEY;
const DEK_PUBLIC_KEY =
  "0x026063780c81991c032fb4fa7485c6607b7542e048ef85d08516fe5c4482360e4b";
const DEK_PRIVATE_KEY =
  "0xc2bbdabb440141efed205497a41d5fb6114e0435fd541e368dc628a8e086bfee";

const useSocialConnect = () => {
  const registerIssuerAccountAndDEK = async () => {
    const provider = new ethers.providers.JsonRpcProvider(ALFAJORES_RPC);
    const issuer = new ethers.Wallet(ISSUER_PRIVATE_KEY, provider);
    const accountsContract = new ethers.Contract(
      ACCOUNTS_PROXY_ADDRESS,
      ACCOUNTS_CONTRACT.abi,
      issuer
    );
    let registeredAccount = await accountsContract.isAccount(issuer.address);
    if (!registeredAccount) {
      console.log("Registering account");
      const receipt = await accountsContract.createAccount();
      await receipt.wait();
      console.log("Account registered");
    } else {
      console.log("Account already registered");
    }

    // Register DEK
    const registerDekTx = await accountsContract.setAccountDataEncryptionKey(
      DEK_PUBLIC_KEY
    );
    await registerDekTx.wait();
    console.log("DEK registered");
  };

  async function registerNumber(phoneNumber, address) {
    const NOW_TIMESTAMP = Math.floor(new Date().getTime() / 1000);

    const provider = new ethers.providers.JsonRpcProvider(ALFAJORES_RPC);
    const issuer = new ethers.Wallet(ISSUER_PRIVATE_KEY, provider);

    const federatedAttestationsContract = new ethers.Contract(
      FA_PROXY_ADDRESS,
      FA_CONTRACT.abi,
      issuer
    );

    try {
      const accounts = await fetchAccounts(phoneNumber);

      if (accounts.length == 0) {
        const authSigner = {
          authenticationMethod: AuthenticationMethod.ENCRYPTION_KEY,
          rawKey: DEK_PRIVATE_KEY,
        };
        const serviceContext = OdisUtils.Query.getServiceContext(
          OdisContextName.ALFAJORES
        );
        const blindingClient = new WebBlsBlindingClient(
          serviceContext.odisPubKey
        );
        await blindingClient.init();
        const obfuscatedIdentifier = (
          await OdisUtils.Identifier.getObfuscatedIdentifier(
            phoneNumber,
            OdisUtils.Identifier.IdentifierPrefix.PHONE_NUMBER,
            issuer.address,
            authSigner,
            serviceContext,
            undefined,
            undefined,
            blindingClient
          )
        ).obfuscatedIdentifier;
        const tx =
          await federatedAttestationsContract.registerAttestationAsIssuer(
            obfuscatedIdentifier,
            address,
            NOW_TIMESTAMP
          );
        await tx.wait();
        console.log("Registered");
        return true;
      } else {
        if (accounts[0] != address) {
          console.log("Already registered with another address");
          return false;
        }
        console.log("Already registered");
        return true;
      }
    } catch (err) {
      console.error(err);
      // handle errors as you see fit
    }
  }

  const fetchAccounts = async (phoneNumber) => {
    const provider = new ethers.providers.JsonRpcProvider(ALFAJORES_RPC);
    const issuer = new ethers.Wallet(ISSUER_PRIVATE_KEY, provider);
    const serviceContext = OdisUtils.Query.getServiceContext(
      OdisContextName.ALFAJORES
    );

    const authSigner = {
      authenticationMethod: AuthenticationMethod.ENCRYPTION_KEY,
      rawKey: DEK_PRIVATE_KEY,
    };

    const federatedAttestationsContract = new ethers.Contract(
      FA_PROXY_ADDRESS,
      FA_CONTRACT.abi,
      issuer
    );

    try {
      const blindingClient = new WebBlsBlindingClient(
        serviceContext.odisPubKey
      );
      await blindingClient.init();
      const obfuscatedIdentifier = (
        await OdisUtils.Identifier.getObfuscatedIdentifier(
          phoneNumber,
          OdisUtils.Identifier.IdentifierPrefix.PHONE_NUMBER,
          issuer.address,
          authSigner,
          serviceContext,
          undefined,
          undefined,
          blindingClient
        )
      ).obfuscatedIdentifier;

      const attestations =
        await federatedAttestationsContract.lookupAttestations(
          obfuscatedIdentifier,
          [issuer.address]
        );
      return attestations.accounts;
    } catch (err) {
      console.error(err);
      // handle errors as you see fit
    }
  };
  const fetchIdentifiers = async (address) => {
    const provider = new ethers.providers.JsonRpcProvider(ALFAJORES_RPC);
    const issuer = new ethers.Wallet(ISSUER_PRIVATE_KEY, provider);

    const federatedAttestationsContract = new ethers.Contract(
      FA_PROXY_ADDRESS,
      FA_CONTRACT.abi,
      issuer
    );

    try {
      const attestations =
        await federatedAttestationsContract.lookupIdentifiers(address, [
          issuer.address,
        ]);
      return attestations.identifiers;
    } catch (err) {
      console.error(err);
      // handle errors as you see fit
    }
  };

  return {
    registerNumber,
    registerIssuerAccountAndDEK,
    fetchAccounts,
    fetchIdentifiers,
  };
};

export default useSocialConnect;
