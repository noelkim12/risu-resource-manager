// vite.config.ts
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
	const isDev = mode === "development";
	const isProd = mode === "production";

	return {
		plugins: [sveltekit(), tailwindcss()],

		// 빌드 최적화
		build: {
			// 소스맵 비활성화 (빌드 속도 향상)
			sourcemap: isDev,

			// 청크 크기 경고 임계값 증가
			chunkSizeWarningLimit: 1000,

			// 롤업 옵션 최적화
			rollupOptions: {
				output: {
					// 청크 분할 최적화
					manualChunks: {
						// 벤더 라이브러리들을 별도 청크로 분리
						"vendor-ui": ["lucide-svelte"],
						"vendor-utils": ["lodash-es", "fflate", "msgpackr"],
						"vendor-tauri": [
							"@tauri-apps/api",
							"@tauri-apps/plugin-dialog",
							"@tauri-apps/plugin-fs",
						],
						"vendor-storage": ["localforage", "@msgpack/msgpack"],
					},
				},
			},

			// 타겟 브라우저 최적화
			target: "esnext",

			// CSS 코드 분할
			cssCodeSplit: true,

			// 압축 최적화
			minify: isProd ? "terser" : false,
		},

		// terser 옵션을 별도로 설정
		...(isProd && {
			terser: {
				compress: {
					drop_console: true,
					drop_debugger: true,
				},
			},
		}),

		// 개발 서버 최적화
		server: {
			// 파일 시스템 감시 최적화
			watch: {
				usePolling: false,
				ignored: ["**/node_modules/**", "**/.git/**", "**/dist/**"],
			},
		},

		// 의존성 최적화
		optimizeDeps: {
			// 사전 번들링할 의존성
			include: [
				"lodash-es",
				"lucide-svelte",
				"fflate",
				"msgpackr",
				"localforage",
				"@msgpack/msgpack",
			],

			// 제외할 의존성
			exclude: ["@tauri-apps/api"],
		},

		// esbuild 최적화
		esbuild: {
			// 개발 모드에서 소스맵 비활성화
			sourcemap: false,

			// 타겟 최적화
			target: "esnext",
		},

		// CSS 최적화
		css: {
			devSourcemap: false,
		},

		// 실험적 기능
		experimental: {
			renderBuiltUrl(filename, { hostType }) {
				if (hostType === "js") {
					return { js: `/${filename}` };
				} else {
					return { relative: true };
				}
			},
		},
	};
});