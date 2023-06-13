import FA_CONTRACT from "../abis/socialconnect/FederatedAttestations.json";
import { useEffect, useState } from "react";
import ACCOUNTS_CONTRACT from "../abis/socialconnect/Accounts.json";

const ALFAJORES_RPC = "https://alfajores-forno.celo-testnet.org";
const FA_PROXY_ADDRESS = "0x70F9314aF173c246669cFb0EEe79F9Cfd9C34ee3";
const ACCOUNTS_PROXY_ADDRESS = "0xed7f51A34B4e71fbE69B3091FcF879cD14bD73A9";

import {
  ACCOUNTS_CONTRACT,
  ACCOUNTS_PROXY_ADDRESS,
  ALFAJORES_CUSD_ADDRESS,
  FA_CONTRACT,
  FA_PROXY_ADDRESS,
  ODIS_PAYMENTS_CONTRACT,
  ODIS_PAYMENTS_PROXY_ADDRESS,
  STABLE_TOKEN_CONTRACT,
} from "./constants";
import { OdisUtils } from "@celo/identity";
import {
  AuthenticationMethod,
  AuthSigner,
  OdisContextName,
} from "@celo/identity/lib/odis/query";
import { ethers } from "ethers";

const ISSUER_PRIVATE_KEY =
  "0x726e53db4f0a79dfd63f58b19874896fce3748fcb80874665e0c147369c04a37";
const DEK_PUBLIC_KEY =
  "0x026063780c81991c032fb4fa7485c6607b7542e048ef85d08516fe5c4482360e4b";
const DEK_PRIVATE_KEY =
  "0xc2bbdabb440141efed205497a41d5fb6114e0435fd541e368dc628a8e086bfee";

const NOW_TIMESTAMP = Math.floor(new Date().getTime() / 1000);
const useSocialConnect = (phoneNumber, account) => {
    const [loading, setLoading] = useState(false);
    const [attestations, setAttestations] = useState([]);

    const registerAttestation = useCallback(async () => {
        const provider = new ethers.providers.JsonRpcProvider(ALFAJORES_RPC);
        const issuer = new ethers.Wallet(ISSUER_PRIVATE_KEY, provider);
        const serviceContext = OdisUtils.Query.getServiceContext(OdisContextName.ALFAJORES);

        const authSigner = {
            authenticationMethod: AuthenticationMethod.ENCRYPTION_KEY,
            rawKey: DEK_PRIVATE_KEY,
        };

        const accountsContract = new ethers.Contract(
            ACCOUNTS_PROXY_ADDRESS,
            ACCOUNTS_CONTRACT.abi,
            issuer
        );
        const federatedAttestationsContract = new ethers.Contract(
            FA_PROXY_ADDRESS,
            FA_CONTRACT.abi,
            issuer
        );

        try {
            await accountsContract.setAccountDataEncryptionKey(DEK_PUBLIC_KEY);
            const obfuscatedIdentifier = (
                await OdisUtils.Identifier.getObfuscatedIdentifier(
                    phoneNumber,
                    OdisUtils.Identifier.IdentifierPrefix.PHONE_NUMBER,
                    issuer.address,
                    authSigner,
                    serviceContext
                )
            ).obfuscatedIdentifier;

            await federatedAttestationsContract.registerAttestationAsIssuer(
                obfuscatedIdentifier,
                account,
                NOW_TIMESTAMP
            );
        } catch (err) {
            console.error(err);
            // handle errors as you see fit
        }
    }, [phoneNumber, account]);

    const lookupAttestations = useCallback(async () => {
        setLoading(true);

        const provider = new ethers.providers.JsonRpcProvider(ALFAJORES_RPC);
        const issuer = new ethers.Wallet(ISSUER_PRIVATE_KEY, provider);
        const serviceContext = OdisUtils.Query.getServiceContext(OdisContextName.ALFAJORES);

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
            const obfuscatedIdentifier = (
                await OdisUtils.Identifier.getObfuscatedIdentifier(
                    phoneNumber,
                    OdisUtils.Identifier.IdentifierPrefix.PHONE_NUMBER,
                    issuer.address,
                    authSigner,
                    serviceContext
                )
            ).obfuscatedIdentifier;

            const attestations = await federatedAttestationsContract.lookupAttestations(obfuscatedIdentifier, [
                issuer.address,
            ]);

            setAttestations(attestations.accounts);
        } catch (err) {
            console.error(err);
            // handle errors as you see fit
        } finally {
            setLoading(false);
        }
    }, [phoneNumber]);

    return { loading, attestations, registerAttestation, lookupAttestations };
};

export default useSocialConnect;