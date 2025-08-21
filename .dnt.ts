import {
	getMetadataFromConfig,
	invokeDenoNodeJSTransformer
} from "DNT";
const configJSR = await getMetadataFromConfig("jsr.jsonc");
await invokeDenoNodeJSTransformer({
	copyAssets: [
		"LICENSE.md",
		"README.md"
	],
	entrypoints: configJSR.getExports(),
	fixInjectedImports: true,
	generateDeclarationMap: true,
	mappings: {
		"https://raw.githubusercontent.com/hugoalh/is-string-ascii-es/v1.1.5/printable.ts": {
			name: "@hugoalh/is-string-ascii",
			version: "^1.1.5",
			subPath: "printable"
		}
	},
	metadata: {
		name: configJSR.getName(),
		version: configJSR.getVersion(),
		description: "A module to handle the HTTP header value.",
		keywords: [
			"handle",
			"handler",
			"header",
			"http"
		],
		homepage: "https://github.com/hugoalh/http-header-value-handler-es#readme",
		bugs: {
			url: "https://github.com/hugoalh/http-header-value-handler-es/issues"
		},
		license: "MIT",
		author: "hugoalh",
		repository: {
			type: "git",
			url: "git+https://github.com/hugoalh/http-header-value-handler-es.git"
		},
		scripts: {
		},
		engines: {
		},
		private: false,
		publishConfig: {
			access: "public"
		}
	},
	outputDirectory: "dist/npm",
	outputDirectoryPreEmpty: true
});
