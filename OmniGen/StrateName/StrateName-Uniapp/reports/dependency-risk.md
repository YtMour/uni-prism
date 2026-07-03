# StrateName Dependency Risk Report

Status: risk

Counts: 4 moderate, 15 high, 0 critical, 19 total.

Direct vulnerable packages: @dcloudio/uni-app, @dcloudio/vite-plugin-uni, vite.

Semver-major fix required: yes.

Recommendation: Do not run npm audit fix --force blindly; validate the uni-app/Vite major upgrade chain in a separate branch.

| Package | Severity | Scope | Fix | Via |
| --- | --- | --- | --- | --- |
| @dcloudio/uni-app | high | direct | semver-major | @dcloudio/uni-cloud; @dcloudio/uni-components; @dcloudio/uni-push |
| @dcloudio/vite-plugin-uni | high | direct | semver-major | @dcloudio/uni-cli-shared; @vitejs/plugin-legacy; @vitejs/plugin-vue |
| vite | high | direct | semver-major | Vite Vulnerable to Path Traversal in Optimized Deps `.map` Handling; launch-editor: NTLMv2 hash disclosure via UNC path handling on Windows; vite: `server.fs.deny` bypass on Windows alternate paths |
| @dcloudio/uni-cli-shared | high | transitive | semver-major | @intlify/core-base; @intlify/vue-devtools; esbuild |
| @dcloudio/uni-cloud | high | transitive | available | @dcloudio/uni-cli-shared |
| @dcloudio/uni-components | high | transitive | available | @dcloudio/uni-cloud; @dcloudio/uni-h5 |
| @dcloudio/uni-h5 | high | transitive | available | @dcloudio/uni-h5-vite |
| @dcloudio/uni-h5-vite | high | transitive | available | @dcloudio/uni-cli-shared |
| @dcloudio/uni-push | high | transitive | semver-major | @dcloudio/uni-cli-shared |
| @dcloudio/uni-stat | high | transitive | available | @dcloudio/uni-cli-shared |
| @intlify/core-base | high | transitive | semver-major | @intlify/message-compiler; @intlify/message-resolver; @intlify/runtime |
| @intlify/message-compiler | high | transitive | available | @intlify/message-resolver |
| @intlify/message-resolver | high | transitive | semver-major | Vue I18n Allows Prototype Pollution in `handleFlatJson` |
| @intlify/runtime | high | transitive | available | @intlify/message-compiler; @intlify/message-resolver |
| @intlify/vue-devtools | high | transitive | available | @intlify/message-resolver; @intlify/runtime |
| @vitejs/plugin-legacy | moderate | transitive | available | vite |
| @vitejs/plugin-vue | moderate | transitive | semver-major | vite |
| @vitejs/plugin-vue-jsx | moderate | transitive | available | vite |
| esbuild | moderate | transitive | semver-major | esbuild enables any website to send any requests to the development server and read the response |
