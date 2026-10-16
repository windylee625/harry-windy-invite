import { fileURLToPath } from 'node:url';

export default {
  plugins: {
    // 明確指定設定檔路徑，從上層資料夾啟動 Vite 時也能正確載入
    tailwindcss: { config: fileURLToPath(new URL('./tailwind.config.js', import.meta.url)) },
    autoprefixer: {},
  },
};
