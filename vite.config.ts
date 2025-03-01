import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			'/api': {
				target: 'https://www.moventis.es', // https://www.moventis.es/api/json/GetTiemposParada/es/124/299/0
				changeOrigin: true,
				secure: true,
			},
		},
	},
});
