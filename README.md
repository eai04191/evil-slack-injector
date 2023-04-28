# evil-slack-injector

![image](https://user-images.githubusercontent.com/3516343/235083072-669f87b5-8f37-4b08-90db-dfc2188700a9.png)

任意の Electron アプリに対して、JavaScript, CSS を注入するツールの PoC です

Chromium のオプションである`--remote-debugging-port`を使って、electron アプリのデバッグポートに接続し、
[Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/) を使って任意のペイロードを送信しています

macOS でのみ動作確認しています

## 注意

Chromium の仕様上`--remote-debugging-port` をつけて起動した後に remote debugging port を閉じることができないため、対象の Electron アプリはポートに接続できるアプリによって常にコントロールされるリスクがあります

そのためこのツールを常用することは強く推奨しません

**このツールを使用したことによるいかなる損害に対しても責任を負いません**

## 使い方

1. 注入する JavaScript, CSS を用意する
   `injection/script.js`, `injection/style.css` に配置する

   ```script.js
   alert("Hello World from injection/script.js!");
   ```

   ```style.css
   .p-top_nav {
       background: linear-gradient(
           to right,
           #ff0000,
           #ff7f00,
           #ffff00,
           #00ff00,
           #0000ff,
           #4b0082,
           #8f00ff
       );
   }
   ```

2. 起動
   ```bash
   deno run --allow-net --allow-run --allow-read ./src/index.ts
   ```

今の所起動するアプリのパスはハードコーディングされているため Slack 以外に注入したい場合は適当に書き換えてください

## 参考

- https://medium.com/@dany74q/injecting-js-into-electron-apps-and-adding-rtl-support-for-microsoft-teams-d315dfb212a6
