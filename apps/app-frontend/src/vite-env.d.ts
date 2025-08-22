/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_API_URI: string;
  readonly VITE_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
