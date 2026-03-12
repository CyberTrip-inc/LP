# CyberTrip Corporate Website

Astro v6 製の CyberTrip コーポレートサイト。JA / EN 対応。

## セットアップ

```bash
npm install
npm run dev     # http://localhost:4321
npm run build   # dist/ に出力
```

## お知らせ・公告の管理

すべて `src/content/news/` 内の **Markdown ファイル**で管理します。
1 ファイルで JA/EN 両方に対応。追加して push するだけで反映されます。

### テンプレート生成（Makefile）

```bash
make news    # お知らせのテンプレートを生成
make notice  # 公告のテンプレートを生成
```

実行すると `src/content/news/` に連番付きの MD ファイルが作られ、エディタで開きます。

### お知らせの追加（手動の場合）

`src/content/news/` に MD ファイルを作成：

```markdown
---
title: "シードラウンド資金調達を完了しました"
title_en: "Completed seed round funding"
date: "2026-06-01"
badge: "News"
badge_en: "News"
link: "/company/"
link_text: "詳しく見る"
link_text_en: "Learn more"
pinned: false
category: "news"
---
```

### 公告の追加（手動の場合）

同じく `src/content/news/` に MD ファイルを作成：

```markdown
---
title: "第1期決算公告"
title_en: "1st Term Financial Statement"
date: "2026-09-01"
badge: "公告"
badge_en: "Notice"
pinned: false
category: "notice"
---
```

### 表示先

| `category` | 表示ページ | 用途 |
|---|---|---|
| `"news"` | `/ja/news/`（`/en/news/`） | プロダクト情報、採用、会社ニュースなど |
| `"notice"` | `/ja/notice/`（`/en/notice/`） | 決算公告、合併公告など法定公告 |

`pinned: true` のものはサイト全ページ上部のバナーにも表示されます。

### Frontmatter フィールド

| フィールド | 必須 | 説明 |
|---|---|---|
| `title` | Yes | 日本語テキスト |
| `title_en` | No | 英語版（未指定なら `title` を使用） |
| `date` | Yes | 日付（YYYY-MM-DD）。新しい順にソート |
| `badge` | No | バッジテキスト（例: "New", "公告"） |
| `badge_en` | No | 英語版バッジ |
| `link` | No | リンク先パス（`/ja/` `/en/` は自動付与） |
| `link_text` | No | リンクテキスト |
| `link_text_en` | No | 英語版リンクテキスト |
| `pinned` | No | `true` で全ページバナーに最優先表示 |
| `category` | No | `"news"`（デフォルト）または `"notice"` |

### 表示ルール

- バナーには **1 件だけ**表示。`pinned: true` が最優先、なければ最新日付
- 英語版フィールド（`*_en`）未指定時は日本語版がフォールバック
- **JA/EN で別ファイルを作る必要はない**（1 ファイルで両方管理）

## ディレクトリ構成

```
src/
  components/     # Astro コンポーネント
  content/
    news/         # お知らせ・公告の MD ファイル
  layouts/        # Base レイアウト
  pages/
    ja/           # 日本語ページ
      news/       # お知らせ一覧
      notice/     # 公告一覧
    en/           # 英語ページ
      news/       # News
      notice/     # Public Notice
    index.astro   # 言語選択ページ
  styles/         # CSS
public/
  icon.png        # サイトアイコン
  scripts/        # JS (GSAP, animations)
```
