# EMULABO HP

このリポジトリには、EMULABOの法人向け相談獲得サイトのコードが含まれます。

## GitHubから編集する

リポジトリは公開されています。コードの閲覧・複製は、GitHubへのサインインなしで [emurin19850204-wq/emulabo-cv-site](https://github.com/emurin19850204-wq/emulabo-cv-site) から行えます。編集、Issue作成、Pull Request作成にはGitHubアカウントでのサインインと、必要な権限が必要です。

ブラウザだけで小さなコード変更を行う場合は、対象ファイルを開いて鉛筆アイコンから編集し、作業ブランチまたはPull Requestとして保存します。複数ファイルを変更する場合はGitHub DesktopまたはVS Codeを使います。

```bash
git clone https://github.com/emurin19850204-wq/emulabo-cv-site.git
cd emulabo-cv-site
pnpm install
pnpm test
pnpm build
```

| 編集対象 | 主なファイル |
| --- | --- |
| 公開トップの見た目 | `client/src/pages/Home.tsx` |
| トップCMSの編集画面 | `client/src/pages/Admin.tsx` |
| 追加ページCMS | `client/src/pages/SitePagesManager.tsx` |
| ブログ・動画CMS | `client/src/pages/BlogVideoManager.tsx` |
| 写真の差し替えUI | `client/src/components/ImageAssetField.tsx` |

## 重要な制約

GitHubで編集できるのはコードです。CMSに保存した文章、写真、ページ、ブログ、動画の実データはGitHubのファイルではなくデータベースに保存されます。GitHubへのプッシュだけではManus上のプレビューや公開サイトへ自動反映されません。GitHubを唯一の編集・公開場所にしたい場合は、GitHub Actionsから外部ホスティングへデプロイする構成を別途設定してください。

詳細な権限・Pull Request・Secretsの扱いは `GITHUB_OPERATIONS.md` を確認してください。
