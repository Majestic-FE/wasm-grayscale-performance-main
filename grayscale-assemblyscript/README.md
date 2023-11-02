# Grayscale by AssemblyScript

下記のブログを参考に対応しました。
https://blog.ttulka.com/learning-webassembly-10-image-processing-in-assemblyscript

## 導入
```sh
npm i
```

## Build
```sh
npm run asbuild:optimized -- --importMemory
```

## ローカルでの動作確認
```sh
npx ws -p 任意のポート番号
```

Ex. 
```sh
npx ws -p 1234
```
上記の場合 `http://127.0.0.1:1234` へアクセス！

