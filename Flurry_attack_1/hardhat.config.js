require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.11",
  networks: {
    hardhat: {
      chainId: 1,
      forking: {
        url: "https://speedy-nodes-nyc.moralis.io/<your api key>/bsc/mainnet/archive",
        blockNumber: 15484858
      },
    }
  }
};