# EMULABO HP GitHub運用ガイド

## 対象と目的

このガイドは、EMULABO HPのコード、Issue、Pull RequestをGitHubで安全に扱うためのものです。対象は **`emurin19850204-wq/emulabo-cv-site`** のみです。このリポジトリはPublicであり、コード・履歴・ドキュメントは誰でも閲覧できる。HPの文章、画像、ページ、リンク、ブログ、動画などの通常更新は、原則としてCMS管理画面（`/admin`）から行います。GitHubは、デザイン・機能・CMSそのものの改修、障害修正、変更履歴のレビューに使用します。

## 許可する操作

| 領域 | 許可する操作 | 備考 |
| --- | --- | --- |
| リポジトリ | コードの閲覧、ブランチ作成、コミット、Pull Request作成・コメント・更新 | このHPリポジトリに限定する。 |
| Issue | 不具合・改善要望の作成、編集、コメント、完了管理 | 個人情報や認証情報を書かない。 |
| Actions | テストとビルドの結果確認 | CIはデプロイを実行しない。 |
| CMS | `/admin` からのコンテンツ更新 | 管理者のみが操作する。 |

## 許可しない操作

リポジトリの削除、組織設定の変更、他リポジトリへのアクセス、Secretsの閲覧・更新、認証情報のコミット、明示承認なしの本番公開は行いません。`main` へ直接変更せず、原則として作業ブランチとPull Requestを使用してください。

## 標準作業フロー

1. 文章・画像・ブログ・動画だけを変更する場合は、まずCMSで下書き保存し、公開ページを確認します。
2. コード変更が必要な場合は、GitHub Issueに目的、対象ページ、受入条件を記載します。
3. `feature/内容` または `fix/内容` のブランチを作成し、変更後に `pnpm test` と `pnpm build` を実行します。
4. Pull Requestに、変更内容、確認した画面、テスト結果、公開への影響を記載します。
5. マージと本番公開は、内容を確認した上で別途明示的に実施します。

## GitHub操作例

```bash
# Issueを作成する
gh issue create --repo emurin19850204-wq/emulabo-cv-site --title "改善: 管理画面の文言" --body "対象と受入条件を記載"

# 作業ブランチを作成する
git switch -c fix/admin-copy

# テストとビルドを確認する
pnpm test && pnpm build

# Pull Requestを作成する
gh pr create --repo emurin19850204-wq/emulabo-cv-site --base main --title "fix: 管理画面の文言を改善" --body "変更内容と確認結果を記載"
```

> GitHubへ認証情報、個人情報、未公開の顧客情報、権利確認前の画像・動画を保存しないでください。

## Manusを使わずにGitHubでコードを編集する

このHPのコードは、公開リポジトリ [emurin19850204-wq/emulabo-cv-site](https://github.com/emurin19850204-wq/emulabo-cv-site) に出力されている。閲覧・複製はサインインなしで行える。編集、Issue、Pull Requestの作成にはGitHubアカウントでサインインし、対象リポジトリに対する書き込み権限を持つ必要がある。

| 方法 | 手順 | 向いている変更 |
| --- | --- | --- |
| GitHub Web | リポジトリで対象ファイルを開き、鉛筆アイコンから編集し、作業ブランチまたはPull Requestを作成する。 | 文言、スタイル、軽微なコード修正 |
| GitHub Desktop | リポジトリをクローンし、エディタで変更後にコミット・プッシュする。 | 複数ファイル、画像UI、機能改修 |
| VS Codeなど | クローンしたフォルダで `pnpm install`、`pnpm test`、`pnpm build` を実行してからPull Requestを作成する。 | テストを伴う本格的な改修 |

コードの主な場所は、公開トップが `client/src/pages/Home.tsx`、トップCMSが `client/src/pages/Admin.tsx`、追加ページが `client/src/pages/SitePagesManager.tsx`、ブログ・動画CMSが `client/src/pages/BlogVideoManager.tsx`、写真変更UIが `client/src/components/ImageAssetField.tsx` である。

> GitHubでのコード編集と、CMSに保存された文章・写真・ブログ・動画データの編集は別である。GitHubの変更は自動でCMSデータを書き換えず、GitHubへプッシュしただけでは現在のManusプレビューや公開サイトにも自動反映されない。GitHubを唯一の編集・公開場所にするには、外部ホスティングまたはGitHubからのデプロイ連携を別途設定する必要がある。
