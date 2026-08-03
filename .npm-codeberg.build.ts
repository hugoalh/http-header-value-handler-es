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
		"https://raw.githubusercontent.com/hugoalh/is-string-ascii-es/v1.1.6/printable.ts": {
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
		homepage: "https://codeberg.org/hugoalh/http-header-value-handler-es#readme",
		bugs: {
			url: "https://codeberg.org/hugoalh/http-header-value-handler-es/issues"
		},
		license: "MIT",
		author: "hugoalh",
		repository: {
			type: "git",
			url: "git+https://codeberg.org/hugoalh/http-header-value-handler-es.git"
		},
		private: false,
		publishConfig: {
			access: "public"
		}
	},
	outputDirectory: "dist/npm-codeberg",
	outputDirectoryPreEmpty: true
});
