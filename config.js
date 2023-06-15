export const config = {
  netowrks: {
    goerli: {
      chainId: "0x5",
      rpcTarget: `https://goerli.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`,
      displayName: "Goerli",
      blockExplorer: "https://goerli.etherscan.io/",
      ticker: "ETH",
      tickerName: "ETH",
    },
    avalanche: {
      chainId: "0xA869",
      rpcTarget: "https://api.avax-test.network/ext/bc/C/rpc",
      displayName: "Avalanche Fuji Testnet",
      blockExplorer: "https://testnet.snowtrace.io",
      ticker: "AVAX",
      tickerName: "AVAX",
    },
    filecoin: {
      chainId: "0xc45",
      rpcTarget: "https://rpc.ankr.com/filecoin_testnet",
      displayName: "Filecoin - Hyperspace testnet",
      blockExplorer: "https://hyperspace.filfox.info/en",
      ticker: "tFIL",
      tickerName: "tFIL",
    },
    alfajores: {
      chainId: "0xaef3",
      rpcTarget: "https://alfajores-forno.celo-testnet.org",
      displayName: "Celo Alfajores Testnet",
      blockExplorer: "https://explorer.celo.org/alfajores/",
      ticker: "CELO",
      tickerName: "CELO",
    },
  },
};
