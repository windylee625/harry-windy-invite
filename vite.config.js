import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 網站完整網址（分享預覽圖需要絕對網址）
// 優先使用環境變數 SITE_URL，其次是 Render 自動提供的 RENDER_EXTERNAL_URL
const SITE_URL = (process.env.SITE_URL || process.env.RENDER_EXTERNAL_URL || '').replace(/\/$/, '');

function siteUrlPlugin() {
  return {
    name: 'site-url',
    transformIndexHtml(html) {
      return html.replaceAll('__SITE_URL__', SITE_URL);
    },
  };
}

export default defineConfig({
  plugins: [react(), siteUrlPlugin()],
  base: './',
});
