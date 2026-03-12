NEWS_DIR := src/content/news
TODAY    := $(shell date +%Y-%m-%d)
NEXT_NUM  = $(shell printf '%03d' $$(( $$(ls -1 $(NEWS_DIR)/*.md 2>/dev/null | wc -l) + 1 )))

.PHONY: news notice

## お知らせテンプレートを生成
news:
	@NUM=$(NEXT_NUM); \
	FILE="$(NEWS_DIR)/$${NUM}-new-post.md"; \
	printf '%s\n' \
		'---' \
		'title: "ここにお知らせタイトル（日本語）"' \
		'title_en: "English title here"' \
		'date: "$(TODAY)"' \
		'badge: "New"' \
		'badge_en: "New"' \
		'link: ""' \
		'link_text: "詳しく見る"' \
		'link_text_en: "Learn more"' \
		'pinned: false' \
		'category: "news"' \
		'---' > "$$FILE"; \
	echo "✓ Created: $$FILE"; \
	echo "  Edit the file, then git add & push."

## 公告テンプレートを生成（決算公告・貸借対照表の要旨）
notice:
	@NUM=$(NEXT_NUM); \
	FILE="$(NEWS_DIR)/$${NUM}-new-notice.md"; \
	printf '%s\n' \
		'---' \
		'title: "第○期決算公告"' \
		'title_en: "Financial Statement — FY○"' \
		'date: "$(TODAY)"' \
		'badge: "公告"' \
		'badge_en: "Notice"' \
		'link: ""' \
		'link_text: ""' \
		'link_text_en: ""' \
		'pinned: false' \
		'category: "notice"' \
		'---' \
		'' \
		'## 貸借対照表の要旨' \
		'' \
		'第○期（○年○月○日〜○年○月○日）' \
		'' \
		'### 資産の部' \
		'' \
		'| 科目 | 金額（円） |' \
		'|------|-----------|' \
		'| 流動資産 | |' \
		'| 　現金及び預金 | |' \
		'| 　売掛金 | |' \
		'| 固定資産 | |' \
		'| 　有形固定資産 | |' \
		'| 　無形固定資産 | |' \
		'| **資産合計** | **0** |' \
		'' \
		'### 負債の部' \
		'' \
		'| 科目 | 金額（円） |' \
		'|------|-----------|' \
		'| 流動負債 | |' \
		'| 　買掛金 | |' \
		'| 　未払金 | |' \
		'| 固定負債 | |' \
		'| **負債合計** | **0** |' \
		'' \
		'### 純資産の部' \
		'' \
		'| 科目 | 金額（円） |' \
		'|------|-----------|' \
		'| 資本金 | |' \
		'| 利益剰余金 | |' \
		'| 　繰越利益剰余金 | |' \
		'| **純資産合計** | **0** |' \
		'' \
		'| | 金額（円） |' \
		'|------|-----------|' \
		'| **負債・純資産合計** | **0** |' \
		'' \
		'以上' \
		'' \
		'株式会社CyberTrip' \
		'代表取締役 熊倉 一哉' > "$$FILE"; \
	echo "✓ Created: $$FILE"; \
	echo "  Edit the file, then git add & push."
