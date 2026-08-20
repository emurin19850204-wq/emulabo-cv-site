# HP編集・GitHub接続の確認記録

確認日: 2026-08-20

## HP編集

管理者として `/admin` にログインし、トップページのコピー、CTA、テキスト配置、画像、法人・個人導線、数値、サービス、事例、プロフィール、FAQ、最終CTAの編集項目を確認した。サイドバーから `/admin/pages`、`/admin/blog`、`/admin/videos` へ遷移でき、追加ページ・リンク、ブログ、動画を個別に編集できる。保存操作は管理者用APIに限定され、公開サイトでは編集画面を公開しない。

| 編集対象 | 管理画面 | 公開確認先 |
| --- | --- | --- |
| トップページ | `/admin` | `/` |
| 追加ページ・リンク | `/admin/pages` | `/{slug}` |
| ブログ | `/admin/blog` | `/blog`、`/blog/{slug}` |
| 動画 | `/admin/videos` | `/videos`、`/videos/{slug}` |

## GitHub接続

非公開リポジトリ `emurin19850204-wq/emulabo-cv-site` を作成し、ローカルプロジェクトには `github` リモートとして接続した。既存の配布用 `origin` リモートは変更していない。接続アカウントは対象リポジトリに対して管理権限を持ち、コード、Issue、Pull Requestを操作できる。

GitHub Actionsには、`main` へのpushとPull Requestで `pnpm test`、`pnpm build` を実行するCIを追加した。CIはリポジトリ内容の読み取り権限だけを使い、デプロイやSecretsの読み取り・更新を実行しない。初回実行ではpnpm設定の重複を検出して修正し、修正版の実行は成功した。

## 運用上の注意

通常の文章・画像・ブログ・動画更新はCMSを使う。コード変更はGitHub Issue、作業ブランチ、テスト・ビルド、Pull Requestの順で扱う。`main` への直接変更、Secretsの操作、リポジトリ削除、明示承認のない公開は実施しない。詳細は `GITHUB_OPERATIONS.md` を参照する。
