const { execSync } = require('child_process');
const { ethers } = require('ethers');

async function runComparisonTest() {
  console.log("🚀 Starting ZKsync EIP712 Signature Comparison Test\n");

  // 首先验证测试参数
  const PRIVATE_KEY = "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110";
  const wallet = new ethers.Wallet(PRIVATE_KEY);
  const expectedAddress = wallet.address;
  
  console.log("📋 Test Configuration:");
  console.log(`Private Key: ${PRIVATE_KEY}`);
  console.log(`Expected Address: ${expectedAddress}`);
  console.log(`Chain ID: 270`);
  console.log("");

  // 运行 JavaScript 版本
  console.log("🟨 Running JavaScript version...");
  console.log("=" * 50);
  
  try {
    // 修改 JS 示例中的 from 地址为正确的地址
    const jsCode = `
    const { ethers } = require("ethers");
    const { Wallet, utils } = require("zksync-ethers");

    async function test() {
      const PRIVATE_KEY = "${PRIVATE_KEY}";
      const CHAIN_ID = 270;
      
      const wallet = new ethers.Wallet(PRIVATE_KEY);
      const fromAddress = wallet.address;
      
      const transaction = {
        type: utils.EIP712_TX_TYPE,
        from: fromAddress,
        to: "0xa61464658AfeAf65CccaaFD3a512b69A83B77618",
        value: ethers.parseEther("0.001"),
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
          paymasterParams: null,
        },
      };

      console.log("From Address:", fromAddress);
      console.log("To Address:", transaction.to);
      console.log("Value:", transaction.value.toString(), "wei");
      console.log("Nonce:", transaction.nonce);
      console.log("");

      const eip712Signer = new utils.EIP712Signer(wallet, CHAIN_ID);
      const signature = await eip712Signer.sign(transaction);
      const serializedTx = utils.serializeEip712(transaction, signature);

      const sig = ethers.Signature.from(signature);
      
      console.log("JavaScript Results:");
      console.log("Signature:", signature);
      console.log("Serialized Tx:", serializedTx);
      console.log("Signature Components:");
      console.log("  r:", sig.r);
      console.log("  s:", sig.s);  
      console.log("  v:", sig.v);
      console.log("  yParity:", sig.yParity);
      console.log("");

      return {
        signature,
        serializedTx,
        components: { r: sig.r, s: sig.s, v: sig.v, yParity: sig.yParity }
      };
    }
    
    test().then(console.log).catch(console.error);
    `;

    // 将 JS 代码写入临时文件并运行
    require('fs').writeFileSync('temp_js_test.js', jsCode);
    const jsOutput = execSync('node temp_js_test.js', { encoding: 'utf8' });
    console.log(jsOutput);
    
    // 清理临时文件
    execSync('rm temp_js_test.js');

  } catch (error) {
    console.error("❌ JavaScript test failed:", error.message);
    return;
  }

  console.log("\n" + "=".repeat(50));
  console.log("🟦 Running Dart version...");
  console.log("=" * 50);

  try {
    // 修改 Dart 示例
    const dartCode = `
import 'dart:typed_data';
import 'package:web3dart/web3dart.dart';

void main() async {
  const privateKeyHex = "${PRIVATE_KEY}";
  const chainId = 270;
  
  final credentials = EthPrivateKey.fromHex(privateKeyHex);
  final fromAddress = credentials.address;
  
  final transaction = Transaction(
    from: fromAddress,
    to: EthereumAddress.fromHex("0xa61464658AfeAf65CccaaFD3a512b69A83B77618"),
    value: EtherAmount.inWei(BigInt.parse("1000000000000000")), // 0.001 ETH
    nonce: 42,
    maxGas: 21000,
    maxFeePerGas: EtherAmount.inWei(BigInt.parse("250000000000")), // 250 gwei
    maxPriorityFeePerGas: EtherAmount.inWei(BigInt.parse("2000000000")), // 2 gwei
    chainId: chainId,
    data: Uint8List(0),
    customData: Eip712Meta(
      gasPerPubdata: BigInt.from(50000),
      factoryDeps: [],
      customSignature: null,
      paymasterParams: null,
    ),
  );

  print("From Address: \${fromAddress.hex}");
  print("To Address: \${transaction.to?.hex}");
  print("Value: \${transaction.value?.getInWei} wei");
  print("Nonce: \${transaction.nonce}");
  print("");

  final signedTxBytes = signTransactionRaw(transaction, credentials, chainId: chainId);
  final signedTxHex = '0x\${signedTxBytes.map((e) => e.toRadixString(16).padLeft(2, '0')).join()}';

  print("Dart Results:");
  print("Serialized Tx: \$signedTxHex");
  print("Transaction Length: \${signedTxBytes.length} bytes");
  print("Type Byte: 0x\${signedTxBytes[0].toRadixString(16)}");
  print("");
}
    `;

    // 将 Dart 代码写入临时文件并运行
    require('fs').writeFileSync('temp_dart_test.dart', dartCode);
    const dartOutput = execSync('dart run temp_dart_test.dart', { 
      encoding: 'utf8',
      cwd: './web3_dart_web'
    });
    console.log(dartOutput);
    
    // 清理临时文件
    execSync('rm temp_dart_test.dart');

  } catch (error) {
    console.error("❌ Dart test failed:", error.message);
    console.error("Make sure you have Dart installed and web3_dart_web dependencies installed");
    return;
  }

  console.log("\n" + "=".repeat(60));
  console.log("🔍 Comparison Results");
  console.log("=".repeat(60));
  console.log("Please compare the 'Serialized Tx' outputs from both versions.");
  console.log("They should be identical if the implementations are correct.");
  console.log("");
  console.log("Note: The signature components (r, s, v) should also match.");
  console.log("The transaction type byte should be 0x71 for both versions.");
}

// 运行对比测试
runComparisonTest().catch(console.error); 