import { readdir, readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import { mdToPdf } from 'md-to-pdf';

const NEWS_DIR = 'src/content/news';
const OUT_DIR = 'public/notices';

/** Parse frontmatter from markdown string */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: '' };

  const data = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^(\w[\w_]*)\s*:\s*"?(.*?)"?\s*$/);
    if (m) {
      const val = m[2];
      if (val === 'true') data[m[1]] = true;
      else if (val === 'false') data[m[1]] = false;
      else data[m[1]] = val;
    }
  }
  return { data, body: match[2].trim() };
}

async function main() {
  if (!existsSync(NEWS_DIR)) {
    console.log('[pdf] No news directory found, skipping.');
    return;
  }

  await mkdir(OUT_DIR, { recursive: true });

  const files = (await readdir(NEWS_DIR)).filter(f => f.endsWith('.md'));
  let count = 0;

  for (const file of files) {
    const raw = await readFile(join(NEWS_DIR, file), 'utf-8');
    const { data, body } = parseFrontmatter(raw);

    if (data.category !== 'notice') continue;
    if (!body) {
      console.log(`[pdf] Skipping ${file} — no body content.`);
      continue;
    }

    const slug = basename(file, '.md');
    const outPath = join(OUT_DIR, `${slug}.pdf`);

    // Build markdown with header
    const title = data.title || 'Public Notice';
    const date = data.date || '';
    const md = [
      `# ${title}`,
      '',
      `**日付:** ${date}`,
      '',
      '---',
      '',
      body,
    ].join('\n');

    try {
      const pdf = await mdToPdf(
        { content: md },
        {
          stylesheet: [],
          css: `
            body {
              font-family: "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif;
              padding: 40px 60px;
              color: #1a1a1a;
              line-height: 1.8;
              font-size: 14px;
            }
            h1 {
              font-size: 22px;
              border-bottom: 2px solid #1a1a1a;
              padding-bottom: 8px;
              margin-bottom: 16px;
            }
            hr {
              border: none;
              border-top: 1px solid #ccc;
              margin: 20px 0;
            }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ccc; padding: 8px 12px; text-align: left; }
            th { background: #f5f5f5; }
          `,
          pdf_options: {
            format: 'A4',
            margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
            printBackground: true,
          },
          launch_options: {
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
          },
        }
      );

      await writeFile(outPath, pdf.content);
      count++;
      console.log(`[pdf] Generated: ${outPath}`);
    } catch (err) {
      console.error(`[pdf] Error generating ${file}:`, err.message);
    }
  }

  console.log(`[pdf] Done. ${count} PDF(s) generated.`);
}

// Need writeFile import
import { writeFile } from 'node:fs/promises';

main().catch(err => {
  console.error('[pdf] Fatal error:', err);
  process.exit(1);
});
