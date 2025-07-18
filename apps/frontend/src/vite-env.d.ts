/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

// Declare MP3 module to allow importing MP3 files
declare module "*.mp3" {
  const src: string;
  export default src;
}
