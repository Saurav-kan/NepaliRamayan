import { copyFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** Site root path. Use `/` for a custom apex domain; use `/RepoName/` for default `*.github.io/RepoName/`. */
const base = process.env.VITE_BASE_PATH ?? '/'

const SEO_TITLE =
  'नेपाली रामचरितमानस | Nepali Ram Charitmanas — Nepali Ramayan (Tulasi Ram Kandel)'

const SEO_DESCRIPTION =
  'Read the Nepali Ram Charitmanas (नेपाली रामचरितमानस) / Nepali Ramayan by Tulasi Ram Kandel. Online WebP reader with chapter jumps. Search: Nepali Ram Charitmanas, Ram Charitmanas, Ramayan, Tulasi Kandel.'

function escapeAttr(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
}

function seoHeadPlugin(): Plugin {
  return {
    name: 'seo-head',
    transformIndexHtml(html) {
      const site = process.env.VITE_SITE_URL?.trim().replace(/\/$/, '') ?? ''
      const basePath = base.replace(/\/$/, '')
      const origin = site ? `${site}${basePath}` : ''
      const canonical = origin ? `${origin}/` : ''

      const tags: string[] = [
        `<meta name="description" content="${escapeAttr(SEO_DESCRIPTION)}" />`,
        `<meta name="keywords" content="${escapeAttr('Nepali Ram Charitmanas, नेपाली रामचरितमानस, Nepali Ramayan, Ramayan, Ram Charitmanas, Tulasi Ram Kandel, Tulasi Kandel, Ram Charitmanas by Tulasi Ram Kandel')}" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:title" content="${escapeAttr(SEO_TITLE)}" />`,
        `<meta property="og:description" content="${escapeAttr(SEO_DESCRIPTION)}" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:title" content="${escapeAttr(SEO_TITLE)}" />`,
        `<meta name="twitter:description" content="${escapeAttr(SEO_DESCRIPTION)}" />`,
      ]

      if (canonical) {
        tags.unshift(`<link rel="canonical" href="${escapeAttr(canonical)}" />`)
        tags.push(`<meta property="og:url" content="${escapeAttr(canonical)}" />`)
      }

      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Book',
        name: 'Nepali Ram Charitmanas',
        alternateName: [
          'नेपाली रामचरितमानस',
          'Nepali Ramayan',
          'Ram Charitmanas',
          'Ramayan',
        ],
        author: {
          '@type': 'Person',
          name: 'Tulasi Ram Kandel',
        },
        inLanguage: 'ne',
        ...(canonical ? { url: canonical } : {}),
      }

      tags.push(
        `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
      )

      return html.replace('</head>', `${tags.join('\n')}\n</head>`)
    },
  }
}

function seoStaticFilesPlugin(): Plugin {
  return {
    name: 'seo-static-files',
    writeBundle(options) {
      const site = process.env.VITE_SITE_URL?.trim().replace(/\/$/, '') ?? ''
      if (!site) return

      const outDir =
        (options.dir as string | undefined) ?? resolve(__dirname, 'dist')
      const basePath = base.replace(/\/$/, '')
      const origin = `${site}${basePath}`

      const robots = [
        'User-agent: *',
        'Allow: /',
        '',
        `Sitemap: ${origin}/sitemap.xml`,
        '',
      ].join('\n')

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${origin}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1</priority>
  </url>
  <url>
    <loc>${origin}/chapters</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
`

      writeFileSync(resolve(outDir, 'robots.txt'), robots)
      writeFileSync(resolve(outDir, 'sitemap.xml'), sitemap)
    },
  }
}

export default defineConfig({
  base,
  plugins: [
    react(),
    seoHeadPlugin(),
    seoStaticFilesPlugin(),
    {
      name: 'copy-index-to-404',
      closeBundle() {
        const outDir = resolve(__dirname, 'dist')
        copyFileSync(resolve(outDir, 'index.html'), resolve(outDir, '404.html'))
      },
    },
  ],
})
