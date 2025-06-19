#!/bin/bash

echo "🚀 ZKsync EIP712 Signature Comparison Test"
echo "=========================================="
echo ""

# 检查 Node.js 和 zksync-ethers
echo "📋 Checking dependencies..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

if ! command -v dart &> /dev/null; then
    echo "❌ Dart is not installed"
    exit 1
fi

echo "✅ Node.js and Dart are available"
echo ""

# 运行 JavaScript 版本
echo "🟨 Running JavaScript version..."
echo "================================="
cd zksync-ethers/examples
if [ ! -f "package.json" ]; then
    echo "Installing dependencies..."
    npm init -y
    npm install zksync-ethers ethers
fi

node sign_comparison.js
JS_EXIT_CODE=$?

if [ $JS_EXIT_CODE -ne 0 ]; then
    echo "❌ JavaScript test failed"
    exit 1
fi

echo ""
echo "================================="
echo "🟦 Running Dart version..."
echo "================================="

cd ../../web3_dart_web
dart pub get
dart run example/sign_comparison.dart
DART_EXIT_CODE=$?

if [ $DART_EXIT_CODE -ne 0 ]; then
    echo "❌ Dart test failed"
    exit 1
fi

echo ""
echo "=========================================="
echo "🔍 Comparison Complete!"
echo "=========================================="
echo "Please manually compare the 'Serialized Transaction' outputs"
echo "from both versions. They should be identical if the"
echo "implementations are correct."
echo ""
echo "Key points to verify:"
echo "- Both transactions start with '0x71' (EIP712 type)"
echo "- The serialized transaction hex strings are identical"
echo "- The signature components (r, s, v) match" 