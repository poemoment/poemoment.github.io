/**
 * Static text content for the pseudo-FS. Inlined directly into the
 * manifest (small, ships once with the page). Long-form content like
 * blog posts is fetched lazily through `endpoint`.
 */

/**
 * Hostname-style label for the FS root. Surfaced in the prompt host
 * segment and as the prefix of `pwd` output.
 */
export const ROOT_LABEL = 'local-site'

export const SOCIAL_LINKS: { label: string; href: string }[] = [
  { label: 'github', href: 'https://github.com/yourname' },
  { label: 'mail', href: 'mailto:hello@example.com' },
  { label: 'home', href: 'http://localhost:4321/' }
]

export const README_TEXT = `local-site - a pseudo-FS over this template.

If you are exploring in terminal mode:
  ls               - see what is here
  search agent     - search posts and notes
  cat about        - short profile placeholder
  cat now          - current focus placeholder
  cd /blog         - recent posts
  cat /blog/<slug>/post  - inline reading view
  manifest         - dump the agent-facing site map
`

export const ABOUT_TEXT = `Your Name
Personal blog template | terminal-first homepage

This local version is intentionally light on real content.
Use it as a shell for essays, notes, links, and project write-ups.

Current mode:
- terminal-first homepage layout
- placeholder content ready to be replaced section by section
- interactive terminal kept as the signature first impression
`

export const NOW_TEXT = `Now:

- polishing the homepage layout
- wiring placeholder sections into a reusable blog shell
- keeping the terminal interaction layer as the main visual hook
`

export const PERSONALITY_TEXT = `# personality.conf

style: terminal-first, editorial, minimal
voice: calm, precise, low-noise
stack: astro, react islands, markdown, local preview
mode: placeholder content until real writing arrives
`

export const MOTD_TEXT = `Welcome to local dev mode.

This is a pseudo-FS exposing the template as a directory tree.
Type \`help\` for commands. Press Esc or run \`exit\` to leave.
`
