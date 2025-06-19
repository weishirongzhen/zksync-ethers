const { Wallet, Provider, utils, EIP712Signer } = require("zksync-ethers");
const { ethers } = require("ethers");

async function signZkSyncTransaction() {
  console.log("=== ZKsync EIP712 Transaction Signing Test (JavaScript) ===\n");

  // 测试参数 - 使用固定值确保可重现
  const PRIVATE_KEY = "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110";
  const CHAIN_ID = 270; // ZKsync Era Sepolia testnet
  
  // 首先获取私钥对应的地址
  const wallet = new ethers.Wallet(PRIVATE_KEY);
  const fromAddress = wallet.address;
  
  const txParams = {
    from: fromAddress, // 使用私钥对应的实际地址
    to: "0xa61464658AfeAf65CccaaFD3a512b69A83B77618",
    value: ethers.parseEther("0.001"), // 0.001 ETH
    nonce: 42,
    gasLimit: 21000,
    maxFeePerGas: ethers.parseUnits("250", "gwei"),
    maxPriorityFeePerGas: ethers.parseUnits("2", "gwei"),
    chainId: CHAIN_ID,
    data: "0x",
    customData: {
      gasPerPubdata: utils.DEFAULT_GAS_PER_PUBDATA_LIMIT,
      factoryDeps: [],
      customSignature: null,
      paymasterParams: utils.getPaymasterParams(
        "0xa222f0c183AFA73a8Bc1AFb48D34C88c9Bf7A174",
        {
          type: "approvalBased",
          token: "0x841c43fa5d8fffdb9efe3358906f7578d8700dd4",
          minimalAllowance: 1n,
          innerInput: new Uint8Array(),
        }
      ),
    },
  };

  console.log("Transaction Parameters:");
  console.log(`Private Key: ${PRIVATE_KEY}`);
  console.log(`Chain ID: ${CHAIN_ID}`);
  console.log(`From: ${txParams.from}`);
  console.log(`To: ${txParams.to}`);
  console.log(`Value: ${txParams.value.toString()} wei`);
  console.log(`Nonce: ${txParams.nonce}`);
  console.log(`Gas Limit: ${txParams.gasLimit}`);
  console.log(`Max Fee Per Gas: ${txParams.maxFeePerGas.toString()} wei`);
  console.log(`Max Priority Fee Per Gas: ${txParams.maxPriorityFeePerGas.toString()} wei`);
  console.log(`Gas Per Pubdata: ${txParams.customData.gasPerPubdata}`);
  console.log("");

  try {
    console.log(`Wallet Address: ${wallet.address}`);
    
    // 验证地址匹配
    if (wallet.address.toLowerCase() !== txParams.from.toLowerCase()) {
      console.error("❌ Address mismatch! Private key doesn't match the from address.");
      return;
    }

    // 构造交易对象
    const transaction = {
      type: utils.EIP712_TX_TYPE,
      from: txParams.from,
      to: txParams.to,
      value: txParams.value,
      nonce: txParams.nonce,
      gasLimit: txParams.gasLimit,
      maxFeePerGas: txParams.maxFeePerGas,
      maxPriorityFeePerGas: txParams.maxPriorityFeePerGas,
      chainId: txParams.chainId,
      data: txParams.data,
      customData: txParams.customData,
    };

    console.log("🔐 Signing transaction...");

    // 方法1: 使用 serializeEip712 手动签名
    const eip712Signer = new EIP712Signer(wallet, CHAIN_ID);
    const signature = await eip712Signer.sign(transaction);
    const serializedTx = utils.serializeEip712(transaction, signature);

    console.log("\n=== Signing Results ===");
    console.log(`Signature: ${signature}`);
    console.log(`Serialized Transaction: ${serializedTx}`);
    
    // 解析签名组件
    const sig = ethers.Signature.from(signature);
    console.log(`Signature Components:`);
    console.log(`  r: ${sig.r}`);
    console.log(`  s: ${sig.s}`);
    console.log(`  v: ${sig.v}`);
    console.log(`  yParity: ${sig.yParity}`);

    // 验证交易长度和格式
    console.log(`\nTransaction Analysis:`);
    console.log(`  Type Byte: 0x${serializedTx.slice(2, 4)} (should be 71)`);
    console.log(`  Total Length: ${(serializedTx.length - 2) / 2} bytes`);

    console.log("\n✅ JavaScript signing completed successfully!");
    
    return {
      signature,
      serializedTx,
      signatureComponents: {
        r: sig.r,
        s: sig.s,
        v: sig.v,
        yParity: sig.yParity
      }
    };

  } catch (error) {
    console.error("❌ Error during signing:", error);
    throw error;
  }
}

// 运行测试
if (require.main === module) {
  signZkSyncTransaction()
    .then((result) => {
      console.log("\n🎉 Test completed!");
    })
    .catch((error) => {
      console.error("💥 Test failed:", error);
      process.exit(1);
    });
}

module.exports = { signZkSyncTransaction }; 
