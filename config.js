export const config = {
  netowrks: {
    goerli: {
      chainId: "0x5",
      rpcTarget: `https://goerli.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`,
      displayName: "Goerli",
      blockExplorer: "https://goerli.etherscan.io/",
    },
    avalanche: {
      chainId: "0xA869",
      rpcTarget: "https://api.avax-test.network/ext/bc/C/rpc",
      displayName: "Avalanche Fuji Testnet",
      blockExplorer: "https://testnet.snowtrace.io",
    },
  },
};
