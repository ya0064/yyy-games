// yxk369 crawler - converts game pages to Jekyll markdown
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const OUT_DIR = 'F:/u-claw/u-claw/u-claw/portable/data/.openclaw/workspace/games-site/_posts';
const PROGRESS_FILE = 'F:/u-claw/u-claw/u-claw/portable/data/.openclaw/workspace/games-site/_posts/progress.json';

function fetchUrl(url, retries = 2) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 20000
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchUrl(res.headers.location, retries).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        if (retries > 0) return fetchUrl(url, retries - 1).then(resolve).catch(reject);
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => {
        const html = Buffer.concat(chunks).toString('utf8');
        resolve(html);
      });
    });
    req.on('error', e => {
      if (retries > 0) fetchUrl(url, retries - 1).then(resolve).catch(reject);
      else reject(e);
    });
    req.setTimeout(20000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function escapeYaml(str) {
  if (!str) return '';
  return String(str).replace(/"/g, '\\"').replace(/\n/g, ' ');
}

function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80);
}

function extractContent(html) {
  // Remove scripts, styles, nav, footer
  let text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  // Find article content - try common WordPress selectors
  const articleMatch = text.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (articleMatch) text = articleMatch[1];

  // Try main content area
  const mainMatch = text.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) text = mainMatch[1];

  // Fallback: look for entry-content or post-content
  const contentMatch = text.match(/class="[^"]*(?:entry-content|post-content|article-content)[^"]*"[^>]*>([\s\S]*?)<div/si);
  if (contentMatch) text = contentMatch[1];

  // Extract title
  const titleMatch = html.match(/<h1[^>]*class="[^"]*title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i) ||
                     html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) ||
                     html.match(/<title>([\s\S]*?)<\/title>/i);
  let title = '';
  if (titleMatch) {
    title = titleMatch[1].replace(/<[^>]+>/g, '').trim();
  }

  // Extract images
  const imgMatches = html.match(/<img[^>]+src="([^"]+)"[^>]*>/gi) || [];
  const images = imgMatches.map(m => {
    const src = m.match(/src="([^"]+)"/);
    const alt = m.match(/alt="([^"]*)"/);
    return { src: src ? src[1] : '', alt: alt ? alt[1] : '' };
  }).filter(i => i.src && !i.src.includes('logo') && !i.src.includes('icon') && !i.src.includes('avatar'));

  // Extract categories/tags from page
  const catMatches = html.match(/<a[^>]+class="[^"]*(?:category|tag)[^"]*"[^>]*>([^<]+)<\/a>/gi) || [];
  const categories = [];
  const tags = [];
  for (const m of catMatches) {
    const name = m.replace(/<[^>]+>/g, '').trim();
    if (m.includes('category') && !categories.includes(name)) categories.push(name);
    if (m.includes('tag') && !tags.includes(name)) tags.push(name);
  }

  // Convert HTML to basic markdown
  let content = text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n\n## ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, "'")
    .replace(/&[a-z]+;/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return { title, content, categories, tags, images };
}

function buildMarkdown(post) {
  const { title, content, categories, tags, images, url, lastmod, pageSlug } = post;

  const date = lastmod ? lastmod.split('T')[0] : '2024-01-01';

  const cat = categories.length > 0 ? categories[0] : '游戏资源';
  const postTags = tags.length > 0 ? tags : ['游戏资源', '单机游戏'];

  let fm = [
    '---',
    `layout: post`,
    `title: "${escapeYaml(title)}"`,
    `category: "${escapeYaml(cat)}"`,
    `date: "${date}"`,
    `tags:`,
    ...postTags.map(t => `  - ${escapeYaml(t)}`),
    `source: "${url}"`,
    `---`,
    ''
  ].join('\n');

  let body = content;

  // Add images section if available
  if (images.length > 0) {
    body += '\n\n## 游戏截图\n\n';
    for (const img of images.slice(0, 10)) {
      const alt = img.alt || title;
      body += `![${alt}](${img.src})\n\n`;
    }
  }

  // Add source note
  body += '\n\n---\n\n*本文来源：[玩丫游戏](https://www.yxk369.com)，资源已迁移至新站。*\n';

  return fm + body;
}

async function crawlOne(entry) {
  const { url, lastmod } = entry;
  try {
    const html = await fetchUrl(url);
    const parsed = extractContent(html);
    
    const pageSlug = url.match(/\/(\d+)\.html/)?.[1] || slugify(parsed.title);
    const title = parsed.title || `游戏 ${pageSlug}`;
    
    const post = {
      ...parsed,
      url,
      lastmod,
      pageSlug
    };

    const md = buildMarkdown(post);
    const date = lastmod ? lastmod.split('T')[0] : '2024-01-01';
    const filename = `${date}-${pageSlug}.md`;
    const filepath = path.join(OUT_DIR, filename);

    // Ensure unique filename
    let counter = 1;
    let finalPath = filepath;
    while (fs.existsSync(finalPath)) {
      finalPath = path.join(OUT_DIR, `${date}-${pageSlug}-${counter}.md`);
      counter++;
    }

    fs.writeFileSync(finalPath, '\ufeff' + md, 'utf8');
    return { success: true, url, title, filename: path.basename(finalPath) };
  } catch (e) {
    return { success: false, url, error: e.message };
  }
}

async function processBatch(items, batchNum, totalBatches) {
  console.error(`[Batch ${batchNum}/${totalBatches}] Starting ${items.length} items...`);
  const results = [];
  for (let i = 0; i < items.length; i++) {
    const r = await crawlOne(items[i]);
    results.push(r);
    process.stdout.write(r.success ? '.' : 'F');
  }
  console.error(`\n[Batch ${batchNum}/${totalBatches}] Done. ${results.filter(r=>r.success).length}/${items.length} succeeded.`);
  return results;
}

// CLI: node crawler.js <startIndex> <endIndex>
async function main() {
  const args = process.argv.slice(2);
  const startIdx = parseInt(args[0] || '0');
  const endIdx = parseInt(args[1] || '100');
  const batchNum = parseInt(args[2] || '1');
  const totalBatches = parseInt(args[3] || '1');

  const allUrls = JSON.parse(fs.readFileSync('F:/u-claw/u-claw/u-claw/portable/data/.openclaw/workspace/games-site/all-urls.json', 'utf8'));
  const items = allUrls.slice(startIdx, endIdx);

  const results = await processBatch(items, batchNum, totalBatches);

  const success = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.error(`\nBatch ${batchNum} complete: ${success} succeeded, ${failed} failed`);
  
  // Update progress
  let progress = { total: allUrls.length, completed: 0, failed: 0, lastUpdate: new Date().toISOString() };
  if (fs.existsSync(PROGRESS_FILE)) {
    try { progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8')); } catch(e) {}
  }
  progress.completed += success;
  progress.failed += failed;
  progress.lastUpdate = new Date().toISOString();
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));

  console.log(JSON.stringify({ success, failed, batchNum }));
}

main().catch(e => { console.error(e); process.exit(1); });