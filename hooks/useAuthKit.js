import {
  SafeAuthKit,
  SafeAuthProviderType,
  Web3AuthModalPack,
} from "@safe-global/auth-kit";
import {
  CHAIN_NAMESPACES,
  WALLET_ADAPTERS,
  ADAPTER_EVENTS,
} from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";

import { useEffect, useState } from "react";
import { config } from "../config";

const modalConfig = {
  [WALLET_ADAPTERS.TORUS_EVM]: {
    label: "torus",
    showOnModal: false,
  },
  [WALLET_ADAPTERS.METAMASK]: {
    label: "metamask",
    showOnDesktop: true,
    showOnMobile: true,
  },
};
const useAuthKit = () => {
  const [safeAuth, setSafeAuth] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    (async () => {
      const options = {
        clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID,
        web3AuthNetwork: "testnet",
        chainConfig: {
          chainNamespace: "eip155",
          ...config.netowrks.goerli,
        },
        uiConfig: {
          theme: "dark",
          loginMethodsOrder: ["google", "facebook"],
        },
      };

      const web3AuthModalPack = new Web3AuthModalPack(options, [], modalConfig);

      const safeAuthKit = await SafeAuthKit.init(web3AuthModalPack, {
        txServiceUrl: "https://safe-transaction-goerli.safe.global",
      });

      setSafeAuth(safeAuthKit);
      setLoading(false);
    })();
  }, []);

  const switchChain = async (chain) => {
    setLoading(true);
    const options = {
      clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID,
      web3AuthNetwork: "testnet",
      chainConfig: {
        chainNamespace: "eip155",
        ...config.netowrks[chain],
      },
      uiConfig: {
        theme: "dark",
        loginMethodsOrder: ["google", "facebook"],
      },
    };

    const web3AuthModalPack = new Web3AuthModalPack(options, [], modalConfig);

    const safeAuthKit = await SafeAuthKit.init(web3AuthModalPack, {
      txServiceUrl: "https://safe-transaction-goerli.safe.global",
    });

    setSafeAuth(safeAuthKit);
    setLoading(false);

    return safeAuthKit;
  };

  return { safeAuth, loading, switchChain };
};

export default useAuthKit;
