# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## プロジェクト概要

このリポジトリは、mabl（E2E テストツール）のための静的 HTML テストサイトです。さまざまな UI パターンを個別のページとして用意しており、ブラウザ操作や要素検出、ダウンロード、フォーム入力などのシナリオをテストできます。

サーバーサイドのアプリケーションロジックはなく、すべてのページは静的ファイルとして Nginx から配信されます。

## 開発・動作確認用コマンド

### Dev Container（推奨）で起動

VS Code Dev Containers などから、`.devcontainer/docker-compose.yml` を使って Nginx コンテナを立ち上げます。

- Dev コンテナ起動（例）
  - `docker-compose -f .devcontainer/docker-compose.yml up`
- アクセス URL
  - `http://localhost:8083`

この構成では、リポジトリ全体が `/usr/share/nginx/html` にマウントされるため、HTML を編集するとブラウザをリロードするだけで即座に反映されます。

### ルートの docker-compose で起動

本番を想定した Nginx コンテナ構成です。ビルド済みイメージを起動し、ポート 80 をローカルの 3000 番に公開します。

- 起動:
  - `docker-compose up`
- アクセス URL:
  - `http://localhost:3000`

### Dockerfile を直接使ったビルド・起動

`Dockerfile` はリポジトリ内の静的ファイルをイメージにコピーし、Nginx のデフォルトドキュメントルートから配信します。

- ビルド:
  - `docker build -t mabl-test .`
- 実行:
  - `docker run -p 3000:80 mabl-test`

### 直接ファイルを開く

Nginx を使わず、ブラウザで `index.html` や `00x/index.html` を直接開いて内容を確認することもできます（ただし、一部の動作は HTTP 経由でのアクセスを前提としている可能性があります）。

## 高レベル構成

### 全体構成

- ルート `index.html`
  - トップページ（日本語）。各テストページへのリンクをまとめたランディングページです。
- `001/` ～ `008/`
  - 番号ごとに独立したテストページを配置したディレクトリです。
  - 代表例:
    - `001/`: 画像表示・ダウンロード挙動のテスト
    - `002/`: テーブル表示（5x5）などのデータ検証
    - `003/`: 6 桁 OTP 入力（オートフォーカス／ペースト対応）
    - `004/`: ファイルアップロードと localStorage を利用した永続化
    - `005/`: Basic 認証 UI のテストページ
    - `006/`: 複数テキスト入力フィールドのテスト
    - `007/`, `008/`: アイコン・PDF などダウンロード／表示系の追加シナリオ

それぞれのディレクトリは「1 ページ完結」の構造になっているため、新しいシナリオを追加する場合も同様に `009/` のようなディレクトリを作成し、その中に `index.html` や関連アセットを置くのが自然です。

### Nginx / Docker 構成

- `Dockerfile`
  - ベースイメージ: `nginx:alpine`
  - ルート `index.html` と `001/` ～ `008/` ディレクトリを、それぞれ `/usr/share/nginx/html/` 配下にコピーします。
  - ポート 80 を公開します（コンテナ外からは `docker run -p 3000:80` 等でアクセス）。

- ルートの `docker-compose.yml`
  - `web` サービスとして上記 Dockerfile をビルドし、コンテナ名 `mabl-test` で起動します。
  - ポートマッピング: `3000:80`。
  - `restart: unless-stopped` でコンテナが自動再起動するよう設定されています。

- `.devcontainer/docker-compose.yml`
  - 開発用に `nginx:alpine` イメージをそのまま使用し、ホスト側のリポジトリをボリュームとしてコンテナにマウントします。
    - `..:/workspace:cached`（作業ディレクトリ）
    - `..:/usr/share/nginx/html:ro`（静的ファイルをそのまま公開）
  - ポートマッピング: `8083:80`。
  - `nginx && tail -f /dev/null` によってコンテナが終了せず、Dev Container 環境として利用できます。

## 変更時に意識すべきポイント

- 各ディレクトリは「テストシナリオごとに完結」しているため、既存のシナリオを壊さないようにすることが重要です。
- 新規ページ追加時は:
  - 新しい番号付きディレクトリ（例: `009/`）を作る
  - ルート `index.html` からのリンクを追加する
  - 必要に応じて `Dockerfile` の `COPY` 行を更新する（本番イメージに含めたい場合）
- Dev Container 構成ではリポジトリ全体がそのまま Nginx から配信されるため、`Dockerfile` を更新しなくてもローカルでの動作確認は可能です。
