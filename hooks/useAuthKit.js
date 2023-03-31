import {
  SafeAuthKit,
  SafeAuthProviderType,
  SafeAuthSignInData,
} from "@safe-global/auth-kit";

import { useEffect, useState } from "react";

const useAuthKit = () => {
  const [safeAuth, setSafeAuth] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const safeAuth = await SafeAuthKit.init(SafeAuthProviderType.Web3Auth, {
        chainId: "0x14a33",
        txServiceUrl: "https://safe-transaction-base-testnet.safe.global/",
        authProviderConfig: {
          rpcTarget: "https://base-goerli.public.blastapi.io",
          clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID,
          network: "testnet",
          theme: "dark",
        },
      });
      setSafeAuth(safeAuth);
      setLoading(false);
    })();
  }, []);

  return { safeAuth, loading };
};

export default useAuthKit;
