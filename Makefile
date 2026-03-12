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

## 公告テンプレートを生成
notice:
	@NUM=$(NEXT_NUM); \
	FILE="$(NEWS_DIR)/$${NUM}-new-notice.md"; \
	printf '%s\n' \
		'---' \
		'title: "ここに公告タイトル（日本語）"' \
		'title_en: "English notice title here"' \
		'date: "$(TODAY)"' \
		'badge: "公告"' \
		'badge_en: "Notice"' \
		'link: ""' \
		'link_text: ""' \
		'link_text_en: ""' \
		'pinned: false' \
		'category: "notice"' \
		'---' > "$$FILE"; \
	echo "✓ Created: $$FILE"; \
	echo "  Edit the file, then git add & push."
