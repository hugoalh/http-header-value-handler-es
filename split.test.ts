import {
	deepStrictEqual,
	throws
} from "node:assert";
import { splitHTTPHeaderValue } from "./split.ts";
Deno.test("Accept 1", { permissions: "none" }, () => {
	const result = [
		["text/html"],
		["application/xhtml+xml"],
		["application/xml", { key: "q", value: "0.9" }],
		["image/webp"],
		["*/*", { key: "q", value: "0.8" }]
	];
	deepStrictEqual(splitHTTPHeaderValue(`text/html, application/xhtml+xml, application/xml;q=0.9, image/webp, */*;q=0.8`), result);
	deepStrictEqual(splitHTTPHeaderValue(` text/html , application/xhtml+xml , application/xml ; q = 0.9 , image/webp , */*; q = 0.8 `), result);
});
Deno.test("Accept 2", { permissions: "none" }, () => {
	const result = [
		["*/*"]
	];
	deepStrictEqual(splitHTTPHeaderValue(`*/*`), result);
	deepStrictEqual(splitHTTPHeaderValue(` */* `), result);
});
Deno.test("Accept 3", { permissions: "none" }, () => {
	const result = [
		["text/html"],
		["application/xhtml+xml"],
		["application/xml", { key: "q", value: "0.9" }],
		["*/*", { key: "q", value: "0.8" }]
	];
	deepStrictEqual(splitHTTPHeaderValue(`text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8`), result);
	deepStrictEqual(splitHTTPHeaderValue(` text/html , application/xhtml+xml , application/xml ; q = 0.9 , */* ; q = 0.8 `), result);
});
Deno.test("Accept 4", { permissions: "none" }, () => {
	const result = [
		["image/avif"],
		["image/webp"],
		["image/png"],
		["image/svg+xml"],
		["image/*", { key: "q", value: "0.8" }],
		["*/*", { key: "q", value: "0.5" }]
	];
	deepStrictEqual(splitHTTPHeaderValue(`image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5`), result);
	deepStrictEqual(splitHTTPHeaderValue(` image/avif , image/webp , image/png , image/svg+xml , image/* ; q = 0.8 , */* ; q = 0.5 `), result);
});
Deno.test("Accept 5", { permissions: "none" }, () => {
	const result = [
		["application/json"]
	];
	deepStrictEqual(splitHTTPHeaderValue(`application/json`), result);
	deepStrictEqual(splitHTTPHeaderValue(` application/json `), result);
});
Deno.test("Accept-CH 1", { permissions: "none" }, () => {
	const result = [
		["Viewport-Width"],
		["Width"]
	];
	deepStrictEqual(splitHTTPHeaderValue(`Viewport-Width, Width`), result);
	deepStrictEqual(splitHTTPHeaderValue(` Viewport-Width , Width `), result);
});
Deno.test("Accept-Encoding 1", { permissions: "none" }, () => {
	const result = [
		["gzip"],
		["deflate"]
	];
	deepStrictEqual(splitHTTPHeaderValue(`gzip, deflate`), result);
	deepStrictEqual(splitHTTPHeaderValue(` gzip , deflate `), result);
});
Deno.test("Accept-Encoding 2", { permissions: "none" }, () => {
	const result = [
		["deflate"],
		["gzip", { key: "q", value: "1.0" }],
		["*", { key: "q", value: "0.5" }]
	];
	deepStrictEqual(splitHTTPHeaderValue(`deflate, gzip;q=1.0, *;q=0.5`), result);
	deepStrictEqual(splitHTTPHeaderValue(` deflate , gzip ; q = 1.0 , * ; q = 0.5 `), result);
});
Deno.test("Accept-Encoding 3", { permissions: "none" }, () => {
	const result = [
		["gzip"],
		["deflate"],
		["br"],
		["zstd"]
	];
	deepStrictEqual(splitHTTPHeaderValue(`gzip, deflate, br, zstd`), result);
	deepStrictEqual(splitHTTPHeaderValue(` gzip , deflate , br , zstd `), result);
});
Deno.test("Accept-Encoding 4", { permissions: "none" }, () => {
	const result = [
		["br", { key: "q", value: "1.0" }],
		["gzip", { key: "q", value: "0.8" }],
		["*", { key: "q", value: "0.1" }]
	];
	deepStrictEqual(splitHTTPHeaderValue(`br;q=1.0, gzip;q=0.8, *;q=0.1`), result);
	deepStrictEqual(splitHTTPHeaderValue(` br ; q = 1.0 , gzip ; q = 0.8 , * ; q = 0.1 `), result);
});
Deno.test("Accept-Language 1", { permissions: "none" }, () => {
	const result = [
		["de", { key: "q", value: "1.0" }],
		["en", { key: "q", value: "0.5" }]
	];
	deepStrictEqual(splitHTTPHeaderValue(`de; q=1.0, en; q=0.5`), result);
	deepStrictEqual(splitHTTPHeaderValue(` de ; q = 1.0 , en ; q = 0.5 `), result);
});
Deno.test("Accept-Language 2", { permissions: "none" }, () => {
	const result = [
		["fr-CH"],
		["fr", { key: "q", value: "0.9" }],
		["en", { key: "q", value: "0.8" }],
		["de", { key: "q", value: "0.7" }],
		["*", { key: "q", value: "0.5" }]
	];
	deepStrictEqual(splitHTTPHeaderValue(`fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5`), result);
	deepStrictEqual(splitHTTPHeaderValue(` fr-CH , fr ; q = 0.9 , en ; q = 0.8 , de ; q = 0.7 , * ; q = 0.5 `), result);
});
Deno.test("Accept-Patch 1", { permissions: "none" }, () => {
	const result = [
		["text/plain", { key: "charset", value: "utf-8" }]
	];
	deepStrictEqual(splitHTTPHeaderValue(`text/plain;charset=utf-8`), result);
	deepStrictEqual(splitHTTPHeaderValue(` text/plain ; charset = utf-8 `), result);
});
Deno.test("Alt-Svc 1", { permissions: "none" }, () => {
	const result = [
		[{ key: "http/1.1", value: "http2.example.com:8001" }, { key: "ma", value: "7200" }]
	];
	deepStrictEqual(splitHTTPHeaderValue(`http/1.1="http2.example.com:8001"; ma=7200`), result);
	deepStrictEqual(splitHTTPHeaderValue(` http/1.1 = "http2.example.com:8001" ; ma = 7200 `), result);
});
Deno.test("Content-Disposition 1", { permissions: "none" }, () => {
	const result = [
		["attachment", { key: "filename", value: "fname.ext" }]
	];
	deepStrictEqual(splitHTTPHeaderValue(`attachment; filename="fname.ext"`), result);
	deepStrictEqual(splitHTTPHeaderValue(` attachment ; filename = "fname.ext" `), result);
});
Deno.test("Content-Type 1", { permissions: "none" }, () => {
	const example = [
		["text/html", { key: "charset", value: "utf-8" }]
	];
	deepStrictEqual(splitHTTPHeaderValue(`text/html; charset=utf-8`), example);
	deepStrictEqual(splitHTTPHeaderValue(` text/html ; charset = utf-8 `), example);
});
Deno.test("Cookie 1", { permissions: "none" }, () => {
	const result = [
		[{ key: "$Version", value: "1" }, { key: "Skin", value: "new" }]
	];
	deepStrictEqual(splitHTTPHeaderValue(`\$Version=1; Skin=new`), result);
	deepStrictEqual(splitHTTPHeaderValue(` \$Version = 1 ; Skin = new `), result);
});
Deno.test("Expect-CT 1", { permissions: "none" }, () => {
	const result = [
		[{ key: "max-age", value: "604800" }],
		["enforce"],
		[{ key: "report-uri", value: "https://example.example/report" }]
	];
	deepStrictEqual(splitHTTPHeaderValue(`max-age=604800, enforce, report-uri="https://example.example/report"`), result);
	deepStrictEqual(splitHTTPHeaderValue(` max-age = 604800 , enforce , report-uri = "https://example.example/report" `), result);
});
Deno.test("Forwarded 1", { permissions: "none" }, () => {
	const result = [
		[{ key: "for", value: "192.0.2.60" }, { key: "proto", value: "http" }, { key: "by", value: "203.0.113.43" }]
	];
	deepStrictEqual(splitHTTPHeaderValue(`for=192.0.2.60;proto=http;by=203.0.113.43`), result);
	deepStrictEqual(splitHTTPHeaderValue(` for = 192.0.2.60 ; proto = http ; by = 203.0.113.43 `), result);
});
Deno.test("Forwarded 2", { permissions: "none" }, () => {
	const result = [
		[{ key: "for", value: "192.0.2.43" }],
		[{ key: "for", value: "198.51.100.17" }]
	];
	deepStrictEqual(splitHTTPHeaderValue(`for=192.0.2.43, for=198.51.100.17`), result);
	deepStrictEqual(splitHTTPHeaderValue(` for = 192.0.2.43 , for = 198.51.100.17 `), result);
});
Deno.test("Link 1", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValue(`</feed>; rel="alternate"`), [
		["</feed>", { key: "rel", value: "alternate" }]
	]);
});
Deno.test("Link 2", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValue(`<https://example.com>; rel="preconnect"`), [
		["<https://example.com>", { key: "rel", value: "preconnect" }]
	]);
});
Deno.test("Link 3", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValue(`https://bad.example; rel="preconnect"`), [
		["https://bad.example", { key: "rel", value: "preconnect" }]
	]);
});
Deno.test("Link 4", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValue(`<https://example.com/%E8%8B%97%E6%9D%A1>; rel="preconnect"`), [
		["<https://example.com/%E8%8B%97%E6%9D%A1>", { key: "rel", value: "preconnect" }]
	]);
});
Deno.test("Link 5", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValue(`<https://example.com/苗条>; rel="preconnect"`), [
		["<https://example.com/苗条>", { key: "rel", value: "preconnect" }]
	]);
});
Deno.test("Link 6", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValue(`<https://one.example.com>; rel="preconnect", <https://two.example.com>; rel="preconnect", <https://three.example.com>; rel="preconnect"`), [
		["<https://one.example.com>", { key: "rel", value: "preconnect" }],
		["<https://two.example.com>", { key: "rel", value: "preconnect" }],
		["<https://three.example.com>", { key: "rel", value: "preconnect" }]
	]);
});
Deno.test("Link 7", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValue(`<https://api.example.com/issues?page=2>; rel="prev", <https://api.example.com/issues?page=4>; rel="next", <https://api.example.com/issues?page=10>; rel="last", <https://api.example.com/issues?page=1>; rel="first"`), [
		["<https://api.example.com/issues?page=2>", { key: "rel", value: "prev" }],
		["<https://api.example.com/issues?page=4>", { key: "rel", value: "next" }],
		["<https://api.example.com/issues?page=10>", { key: "rel", value: "last" }],
		["<https://api.example.com/issues?page=1>", { key: "rel", value: "first" }]
	]);
});
Deno.test("Link 8", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValue(`</style.css>; rel=preload; as=style; fetchpriority="high"`), [
		["</style.css>", { key: "rel", value: "preload" }, { key: "as", value: "style" }, { key: "fetchpriority", value: "high" }]
	]);
});
Deno.test("NEL 1", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValue(`{ "report_to": "name_of_reporting_group", "max_age": 12345, "include_subdomains": false, "success_fraction": 0.0, "failure_fraction": 1.0 }`), [
		[`{ "report_to": "name_of_reporting_group", "max_age": 12345, "include_subdomains": false, "success_fraction": 0.0, "failure_fraction": 1.0 }`]
	]);
});
Deno.test("P3P 1", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValue(`CP="This is not a P3P policy! See https://en.wikipedia.org/wiki/Special:CentralAutoLogin/P3P for more info."`), [
		[{ key: "CP", value: "This is not a P3P policy! See https://en.wikipedia.org/wiki/Special:CentralAutoLogin/P3P for more info." }]
	]);
});
Deno.test("Permissions-Policy 1", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValue(`fullscreen=(), camera=(), microphone=(), geolocation=(), interest-cohort=()`), [
		[{ key: "fullscreen", value: "()" }],
		[{ key: "camera", value: "()" }],
		[{ key: "microphone", value: "()" }],
		[{ key: "geolocation", value: "()" }],
		[{ key: "interest-cohort", value: "()" }]
	]);
});
Deno.test("Prefer 1", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValue(`return=representation`), [
		[{ key: "return", value: "representation" }]
	]);
});
Deno.test("Preference-Applied 1", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValue(`return=representation`), [
		[{ key: "return", value: "representation" }]
	]);
});
Deno.test("Public-Key-Pins 1", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValue(`max-age=2592000; pin-sha256="E9CZ9INDbd+2eRQozYqqbQ2yXLVKB9+xcprMF+44U1g="`), [
		[{ key: "max-age", value: "2592000" }, { key: "pin-sha256", value: "E9CZ9INDbd+2eRQozYqqbQ2yXLVKB9+xcprMF+44U1g=" }]
	]);
});
Deno.test("Refresh 1", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValue(`5; url=http://www.w3.org/pub/WWW/People.html`), [
		["5", { key: "url", value: "http://www.w3.org/pub/WWW/People.html" }]
	]);
});
Deno.test("Report-To 1", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValue(`{ "group": "csp-endpoint", "max_age": 10886400, "endpoints": [ { "url": "https-url-of-site-which-collects-reports" } ] }`), [
		[`{ "group": "csp-endpoint", "max_age": 10886400, "endpoints": [ { "url": "https-url-of-site-which-collects-reports" } ] }`]
	]);
});
Deno.test("Set-Cookie 1", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValue(`CookieName=CookieValue; Max-Age=3600; Version=1`), [
		[{ key: "CookieName", value: "CookieValue" }, { key: "Max-Age", value: "3600" }, { key: "Version", value: "1" }]
	]);
});
Deno.test("Strict-Transport-Security 1", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValue(`max-age=16070400; includeSubDomains`), [
		[{ key: "max-age", value: "16070400" }, "includeSubDomains"]
	]);
});
Deno.test("Upgrade 1", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValue(`h2c, HTTPS/1.3, IRC/6.9, RTA/x11, websocket`), [
		["h2c"],
		["HTTPS/1.3"],
		["IRC/6.9"],
		["RTA/x11"],
		["websocket"]
	]);
});
Deno.test("Via 1", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValue(`1.0 fred, 1.1 example.com (Apache/1.1)`), [
		["1.0 fred"],
		["1.1 example.com (Apache/1.1)"]
	]);
});
Deno.test("X-Forwarded-For 1", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValue(`client1, proxy1, proxy2`), [
		["client1"],
		["proxy1"],
		["proxy2"]
	]);
});
Deno.test("Invalid 1", { permissions: "none" }, () => {
	throws(() => {
		splitHTTPHeaderValue(`text/html, application/xhtml+xml, application/xml;q=0.9, image/webp, */*;q=0.8,`);
	});
});
