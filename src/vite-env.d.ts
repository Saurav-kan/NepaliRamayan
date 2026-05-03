/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BOOK_URL?: string
  /** Display page 1…27 for new sessions (see `src/readingConfig.ts`). */
  readonly VITE_DEFAULT_PAGE?: string
  /** Public site URL, no trailing slash (e.g. `https://nepaliramcharitmanas.me`). Build-time SEO. */
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
