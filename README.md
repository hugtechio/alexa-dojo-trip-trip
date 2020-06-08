# Alexa Dojo サンプルスキル 妄想トリップ

このスキルは、YouTube チャンネル [Alexa Developers JP](https://www.youtube.com/channel/UC_oCQTeG5bQUyn_7tvyEuSw) から配信されました alexa道場 #004 で使用したサンプルスキルです。
Situational Design Principal No2 "Be personal" の実装例として、S3PersistentAdapter を利用して、Welcome メッセージを切り替える方法を紹介します。

# スキルの概要
ユーザーがアレクサに伝えた場所の音を流して、旅行に行った気になれるスキルです。

例）
ユーザー： アレクサ、妄想トリップを開いて
アレクサ： 妄想トリップへようこそ。このスキルでは、。。。
ユーザー： アムステルダムに行きたい
アレクサ： わかりました。いってらっしゃい。<アムステルダムの音>

# 実装の内容
ユーザーが最初にスキルを１回目、２回目、３回目と起動したとき、異なるWelcomeメッセージを発話させます。
２回目以降は、前回訪れた場所とスキルの起動回数を覚えておき、Welcomeメッセージに利用します。

# サンプルスキルで扱う内容
- S3PersistenceAdapterを利用したコンテキストの保存
- コンテキストの設計例
- コンテキストの読み出しと利用
- Welcomeメッセージ、コンテキストの保存のテスト

# サンプルスキルで扱うライブラリ
- ask-sdk
- S3PersistenceAdapter
- jest(テスト)

