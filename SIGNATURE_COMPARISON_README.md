# ZKsync EIP712 签名对比测试

这个测试用于对比 JavaScript (zksync-ethers) 和 Dart (web3_dart_web) 两个版本的 ZKsync EIP712 交易签名实现。

## 📋 测试目标

验证 Dart 实现的 ZKsync EIP712 交易签名是否与官方 JavaScript 实现产生相同的结果。

## 🚀 运行测试

### 方法一：使用自动化脚本

```bash
./run_tests.sh
```

### 方法二：手动运行

#### JavaScript 版本
```bash
cd zksync-ethers/examples
npm install
node sign_comparison.js
```

#### Dart 版本
```bash
cd web3_dart_web
dart pub get
dart run example/sign_comparison.dart
```

## 📊 测试参数

两个版本使用完全相同的测试参数：

- **私钥**: `0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110`
- **链 ID**: `270` (ZKsync Era Sepolia testnet)
- **接收地址**: `0xa61464658AfeAf65CccaaFD3a512b69A83B77618`
- **转账金额**: `0.001 ETH`
- **Nonce**: `42`
- **Gas Limit**: `21000`
- **Max Fee Per Gas**: `250 gwei`
- **Max Priority Fee Per Gas**: `2 gwei`
- **Gas Per Pubdata**: `50000`

## 🔍 对比要点

运行测试后，请对比以下输出：

1. **序列化交易**: 两个版本的 `Serialized Transaction` 应该完全相同
2. **交易类型**: 都应该以 `0x71` 开头 (EIP712 类型)
3. **签名组件**: r, s, v 值应该匹配 (仅 JavaScript 版本显示)
4. **交易长度**: 字节长度应该相同

## ✅ 成功标准

如果实现正确，两个版本应该产生：
- 相同的序列化交易十六进制字符串
- 相同的交易字节长度
- 相同的 EIP712 类型标识 (0x71)

## 🔧 依赖要求

### JavaScript 版本
- Node.js
- zksync-ethers 包
- ethers 包

### Dart 版本  
- Dart SDK
- web3dart 包的依赖项

## 📝 示例输出

### JavaScript 输出
```
From Address: 0x8ba1f109551bD432803012645Hac136c31167C16eC
To Address: 0xa61464658AfeAf65CccaaFD3a512b69A83B77618
Value: 1000000000000000 wei
Nonce: 42

JavaScript Results:
Signature: 0x...
Serialized Tx: 0x71f87f8080808094a61464658afeaf65cccaafd3a512b69A83B77618830f42408001a0...
```

### Dart 输出
```
From Address: 0x8ba1f109551bD432803012645Hac136c31167C16eC
To Address: 0xa61464658AfeAf65CccaaFD3a512b69A83B77618
Value: 1000000000000000 wei
Nonce: 42

Dart Results:
Serialized Tx: 0x71f87f8080808094a61464658afeaf65cccaafd3a512b69A83B77618830f42408001a0...
```

两个 `Serialized Tx` 应该完全相同！

## 🐛 故障排除

1. **地址不匹配错误**: 确保私钥与 from 地址匹配
2. **依赖问题**: 运行 `npm install` 或 `dart pub get`
3. **Dart 编译错误**: 检查 web3_dart_web 项目的依赖配置 