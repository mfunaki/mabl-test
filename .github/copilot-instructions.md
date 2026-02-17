# Copilot Instructions

This file provides guidance to GitHub Copilot when working with code in this repository.

> **共通ガイドライン**: プロジェクトの概要・構成・開発コマンド・Docker 構成については [instructions.md](../instructions.md) を参照してください。

## Copilot 固有の指示

- このリポジトリは mabl（E2E テストツール）のための**静的 HTML テストサイト**です
- サーバーサイドロジックは存在せず、すべて Nginx から配信される静的ファイルです
- 各ディレクトリ（001/, 002/, ...）は独立したテストシナリオを持つため、既存ページの動作を壊さないよう注意してください

### 新規テストページ追加時の必須手順（重要）

新しい番号付きディレクトリ（例: 011/）を作成する際は、**以下の 3 ファイルすべてを必ず更新してください**：

1. **`Dockerfile`** に `COPY` 行を追加
   ```dockerfile
   COPY 011/ /usr/share/nginx/html/011/
   ```
   - これを忘れると本番環境で 404 エラーになります（Dev Container では問題が発覚しません）

2. **`.github/workflows/deploy-mabl-test.yml`** の `paths` にディレクトリを追加
   ```yaml
   - '011/**'
   ```
   - これを忘れると新規ディレクトリ変更時にデプロイが実行されません

3. **`index.html`** のメニューにリンクを追加
   ```html
   <li><a href="011/">011 - テスト内容の説明</a></li>
   ```

### コーディング規約

- シンプルな HTML/CSS/JavaScript を使用し、外部ライブラリへの依存は最小限に
- 各ページは `index.html` として作成し、ディレクトリ単位で完結させる
- テストシナリオの意図を明確にするため、ページタイトルや説明文は簡潔かつ具体的に
- ページ内で使用する画像・PDF などのアセットは同じディレクトリに配置する
