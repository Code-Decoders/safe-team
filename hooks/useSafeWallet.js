import Web3 from "web3";
import Web3Adapter from "@safe-global/safe-web3-lib";
import SafeServiceClient from "@safe-global/safe-service-client";
import { SafeFactory } from "@safe-global/safe-core-sdk";

/*
    This is a custom hook that can be used to create a Safe wallet.

    usage:

    const { create } = useSafeWallet();
    create(await safeAuth.getProvider() , [safeAuth.getAddress(), ...teamMembers]);
*/

const useSafeWallet = () => {
  const create = async (provider, owners) => {
    const web3 = new Web3(provider);

    const address = (await web3.eth.getAccounts())[0];
    console.log("address", address);

    const ethAdapter = new Web3Adapter({
      web3,
      signerAddress: address,
    });
    console.log("ethAdapter", ethAdapter);

    const safeFactory = await SafeFactory.create({
      ethAdapter: ethAdapter,
    });
    console.log("sf", safeFactory);

    const safeAccountConfig = {
      owners: owners,
      threshold: owners.length,
    };
    

    const safeSdkOwner = await safeFactory.deploySafe({ safeAccountConfig });
    console.log("owner", safeSdkOwner);

    const safeAddress = safeSdkOwner.getAddress();

    console.log("Your Safe has been deployed:");
    console.log(`https://goerli.etherscan.io/address/${safeAddress}`);
    console.log(`https://app.safe.global/gor:${safeAddress}`);

    return safeAddress;
  };

  return { create };
};

export default useSafeWallet;
