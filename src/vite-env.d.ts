/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BOOK_URL?: string
  /** Optional. Starting page for new sessions (see `src/readingConfig.ts`). */
  readonly VITE_DEFAULT_PAGE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
