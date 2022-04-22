require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.11",
  networks: {
    hardhat: {
      chainId: 1,
      forking: {
        url: "https://speedy-nodes-nyc.moralis.io/bc0f5422d58a74dcb7810f1b/bsc/mainnet/archive",
        blockNumber: 15484858
      },
    }
  }
};