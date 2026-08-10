import {
	readManifest,
	transform
} from "DNT";
const manifest = await readManifest("jsr.jsonc");
await transform({
	copyEntries: [
		"LICENSE.md",
		"README.md"
	],
	//@ts-ignore Lazy type.
	entrypointsScript: manifest.exports,
	generateDeclarationMap: true,
	mappings: {
		"jsr:@hugoalh/is-string-ascii@^1.1.6/printable": {
			name: "@hugoalh/is-string-ascii",
			version: "^1.1.6",
			subPath: "printable"
		}
	},
	metadata: {
		//@ts-ignore Lazy type.
		name: manifest.name,
		//@ts-ignore Lazy type.
		version: manifest.version,
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
		private: false,
		publishConfig: {
			access: "public"
		}
	},
	outputDirectory: "dist/npm-github",
	outputDirectoryPreEmpty: true
});
