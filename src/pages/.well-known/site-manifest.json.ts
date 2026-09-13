import type { APIRoute } from 'astro'

import { ROOT_LABEL } from '@/components/terminal/fs/content'
import { buildSiteFs } from '@/components/terminal/fs/server'

const SITE_URL = 'https://example.com'

const INSTRUCTIONS = `You are reading a structured map of this personal blog template.

Quick start:
  - Read the "description" field for context.
  - Walk "tree"; it mirrors a Unix-style filesystem.
  - Files may contain inline "content" or an "endpoint" for full content.
  - For blog posts, GET "<endpoint>" returns { html, headings }.

If you are a human exploring this URL, open the site and press backtick to enter dev mode.`

export const GET: APIRoute = async () => {
  const tree = await buildSiteFs()

  const manifest = {
    version: '0.1',
    name: ROOT_LABEL,
    site: SITE_URL,
    description:
      'A reusable Astro personal blog template with a terminal-first homepage, markdown content, search, notes, projects, links, and an agent-readable site map.',
    instructions: INSTRUCTIONS,
    tree,
    endpoints: {
      blog_post: {
        url: `${SITE_URL}/api/blog/<id>`,
        method: 'GET',
        format: 'json',
        fields: ['html', 'headings'],
        note:
          'Use the endpoint field from a post node directly. Astro collection ids and filesystem-safe names can differ.'
      },
      well_known_manifest: {
        url: `${SITE_URL}/.well-known/site-manifest.json`,
        method: 'GET',
        format: 'json',
        note: 'this document'
      }
    },
    links: {
      site: SITE_URL,
      github: 'https://github.com/yourname/your-blog',
      rss: `${SITE_URL}/rss.xml`,
      sitemap: `${SITE_URL}/sitemap-index.xml`
    },
    generated_at: new Date().toISOString()
  }

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=300, s-maxage=86400',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, OPTIONS',
      'x-robots-tag': 'all'
    }
  })
}

export const OPTIONS: APIRoute = () =>
  new Response(null, {
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, OPTIONS',
      'access-control-max-age': '86400'
    }
  })
