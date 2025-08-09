import { deepStrictEqual } from "node:assert";
import {
	splitHTTPHeaderValueWithoutParameter,
	splitHTTPHeaderValueWithParameter
} from "./mod.ts";
Deno.test("Accept 1", { permissions: "none" }, () => {
	const result = [
		["text/html"],
		["application/xhtml+xml"],
		["application/xml", ["q", "0.9"]],
		["image/webp"],
		["*/*", ["q", "0.8"]]
	];
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`text/html, application/xhtml+xml, application/xml;q=0.9, image/webp, */*;q=0.8`), result);
	deepStrictEqual(splitHTTPHeaderValueWithParameter(` text/html , application/xhtml+xml , application/xml ; q = 0.9 , image/webp , */*; q = 0.8 `), result);
});
Deno.test("Accept 2", { permissions: "none" }, () => {
	const result = [
		["*/*"]
	];
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`*/*`), result);
	deepStrictEqual(splitHTTPHeaderValueWithParameter(` */* `), result);
});
Deno.test("Accept 3", { permissions: "none" }, () => {
	const result = [
		["text/html"],
		["application/xhtml+xml"],
		["application/xml", ["q", "0.9"]],
		["*/*", ["q", "0.8"]]
	];
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8`), result);
	deepStrictEqual(splitHTTPHeaderValueWithParameter(` text/html , application/xhtml+xml , application/xml ; q = 0.9 , */* ; q = 0.8 `), result);
});
Deno.test("Accept 4", { permissions: "none" }, () => {
	const result = [
		["image/avif"],
		["image/webp"],
		["image/png"],
		["image/svg+xml"],
		["image/*", ["q", "0.8"]],
		["*/*", ["q", "0.5"]]
	];
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5`), result);
	deepStrictEqual(splitHTTPHeaderValueWithParameter(` image/avif , image/webp , image/png , image/svg+xml , image/* ; q = 0.8 , */* ; q = 0.5 `), result);
});
Deno.test("Accept 5", { permissions: "none" }, () => {
	const result = [
		["application/json"]
	];
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`application/json`), result);
	deepStrictEqual(splitHTTPHeaderValueWithParameter(` application/json `), result);
});
Deno.test("Accept-CH 1", { permissions: "none" }, () => {
	const result = [
		"Viewport-Width",
		"Width"
	];
	deepStrictEqual(splitHTTPHeaderValueWithoutParameter(`Viewport-Width, Width`), result);
	deepStrictEqual(splitHTTPHeaderValueWithoutParameter(` Viewport-Width , Width `), result);
});
Deno.test("Accept-Encoding 1", { permissions: "none" }, () => {
	const result = [
		["gzip"],
		["deflate"]
	];
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`gzip, deflate`), result);
	deepStrictEqual(splitHTTPHeaderValueWithParameter(` gzip , deflate `), result);
});
Deno.test("Accept-Encoding 2", { permissions: "none" }, () => {
	const result = [
		["deflate"],
		["gzip", ["q", "1.0"]],
		["*", ["q", "0.5"]]
	];
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`deflate, gzip;q=1.0, *;q=0.5`), result);
	deepStrictEqual(splitHTTPHeaderValueWithParameter(` deflate , gzip ; q = 1.0 , * ; q = 0.5 `), result);
});
Deno.test("Accept-Encoding 3", { permissions: "none" }, () => {
	const result = [
		["gzip"],
		["deflate"],
		["br"],
		["zstd"]
	];
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`gzip, deflate, br, zstd`), result);
	deepStrictEqual(splitHTTPHeaderValueWithParameter(` gzip , deflate , br , zstd `), result);
});
Deno.test("Accept-Encoding 4", { permissions: "none" }, () => {
	const result = [
		["br", ["q", "1.0"]],
		["gzip", ["q", "0.8"]],
		["*", ["q", "0.1"]]
	];
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`br;q=1.0, gzip;q=0.8, *;q=0.1`), result);
	deepStrictEqual(splitHTTPHeaderValueWithParameter(` br ; q = 1.0 , gzip ; q = 0.8 , * ; q = 0.1 `), result);
});
Deno.test("Accept-Language 1", { permissions: "none" }, () => {
	const result = [
		["de", ["q", "1.0"]],
		["en", ["q", "0.5"]]
	];
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`de; q=1.0, en; q=0.5`), result);
	deepStrictEqual(splitHTTPHeaderValueWithParameter(` de ; q = 1.0 , en ; q = 0.5 `), result);
});
Deno.test("Accept-Language 2", { permissions: "none" }, () => {
	const result = [
		["fr-CH"],
		["fr", ["q", "0.9"]],
		["en", ["q", "0.8"]],
		["de", ["q", "0.7"]],
		["*", ["q", "0.5"]]
	];
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5`), result);
	deepStrictEqual(splitHTTPHeaderValueWithParameter(` fr-CH , fr ; q = 0.9 , en ; q = 0.8 , de ; q = 0.7 , * ; q = 0.5 `), result);
});
Deno.test("Accept-Patch 1", { permissions: "none" }, () => {
	const result = [
		["text/plain", ["charset", "utf-8"]]
	];
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`text/plain;charset=utf-8`), result);
	deepStrictEqual(splitHTTPHeaderValueWithParameter(` text/plain ; charset = utf-8 `), result);
});
Deno.test("Alt-Svc 1", { permissions: "none" }, () => {
	const result = [
		[["http/1.1", "http2.example.com:8001"], ["ma", "7200"]]
	];
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`http/1.1="http2.example.com:8001"; ma=7200`), result);
	deepStrictEqual(splitHTTPHeaderValueWithParameter(` http/1.1 = "http2.example.com:8001" ; ma = 7200 `), result);
});
Deno.test("Content-Disposition 1", { permissions: "none" }, () => {
	const result = [
		["attachment", ["filename", "fname.ext"]]
	];
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`attachment; filename="fname.ext"`), result);
	deepStrictEqual(splitHTTPHeaderValueWithParameter(` attachment ; filename = "fname.ext" `), result);
});
Deno.test("Content-Type 1", { permissions: "none" }, () => {
	const example = [
		["text/html", ["charset", "utf-8"]]
	];
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`text/html; charset=utf-8`), example);
	deepStrictEqual(splitHTTPHeaderValueWithParameter(` text/html ; charset = utf-8 `), example);
});
Deno.test("Cookie 1", { permissions: "none" }, () => {
	const result = [
		[["$Version", "1"], ["Skin", "new"]]
	];
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`\$Version=1; Skin=new`), result);
	deepStrictEqual(splitHTTPHeaderValueWithParameter(` \$Version = 1 ; Skin = new `), result);
});
Deno.test("Expect-CT 1", { permissions: "none" }, () => {
	const result = [
		[["max-age", "604800"]],
		["enforce"],
		[["report-uri", "https://example.example/report"]]
	];
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`max-age=604800, enforce, report-uri="https://example.example/report"`), result);
	deepStrictEqual(splitHTTPHeaderValueWithParameter(` max-age = 604800 , enforce , report-uri = "https://example.example/report" `), result);
});
Deno.test("Forwarded 1", { permissions: "none" }, () => {
	const result = [
		[["for", "192.0.2.60"], ["proto", "http"], ["by", "203.0.113.43"]]
	];
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`for=192.0.2.60;proto=http;by=203.0.113.43`), result);
	deepStrictEqual(splitHTTPHeaderValueWithParameter(` for = 192.0.2.60 ; proto = http ; by = 203.0.113.43 `), result);
});
Deno.test("Forwarded 2", { permissions: "none" }, () => {
	const result = [
		[["for", "192.0.2.43"]],
		[["for", "198.51.100.17"]]
	];
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`for=192.0.2.43, for=198.51.100.17`), result);
	deepStrictEqual(splitHTTPHeaderValueWithParameter(` for = 192.0.2.43 , for = 198.51.100.17 `), result);
});
Deno.test("Link 1", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`</feed>; rel="alternate"`), [
		["</feed>", ["rel", "alternate"]]
	]);
});
Deno.test("Link 2", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`<https://example.com>; rel="preconnect"`), [
		["<https://example.com>", ["rel", "preconnect"]]
	]);
});
Deno.test("Link 3", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`https://bad.example; rel="preconnect"`), [
		["https://bad.example", ["rel", "preconnect"]]
	]);
});
Deno.test("Link 4", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`<https://example.com/%E8%8B%97%E6%9D%A1>; rel="preconnect"`), [
		["<https://example.com/%E8%8B%97%E6%9D%A1>", ["rel", "preconnect"]]
	]);
});
Deno.test("Link 5", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`<https://example.com/苗条>; rel="preconnect"`), [
		["<https://example.com/苗条>", ["rel", "preconnect"]]
	]);
});
Deno.test("Link 6", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`<https://one.example.com>; rel="preconnect", <https://two.example.com>; rel="preconnect", <https://three.example.com>; rel="preconnect"`), [
		["<https://one.example.com>", ["rel", "preconnect"]],
		["<https://two.example.com>", ["rel", "preconnect"]],
		["<https://three.example.com>", ["rel", "preconnect"]]
	]);
});
Deno.test("Link 7", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`<https://api.example.com/issues?page=2>; rel="prev", <https://api.example.com/issues?page=4>; rel="next", <https://api.example.com/issues?page=10>; rel="last", <https://api.example.com/issues?page=1>; rel="first"`), [
		["<https://api.example.com/issues?page=2>", ["rel", "prev"]],
		["<https://api.example.com/issues?page=4>", ["rel", "next"]],
		["<https://api.example.com/issues?page=10>", ["rel", "last"]],
		["<https://api.example.com/issues?page=1>", ["rel", "first"]]
	]);
});
Deno.test("Link 8", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`</style.css>; rel=preload; as=style; fetchpriority="high"`), [
		["</style.css>", ["rel", "preload"], ["as", "style"], ["fetchpriority", "high"]]
	]);
});
Deno.test("NEL 1", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`{ "report_to": "name_of_reporting_group", "max_age": 12345, "include_subdomains": false, "success_fraction": 0.0, "failure_fraction": 1.0 }`), [
		[`{ "report_to": "name_of_reporting_group", "max_age": 12345, "include_subdomains": false, "success_fraction": 0.0, "failure_fraction": 1.0 }`]
	]);
});
Deno.test("P3P 1", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`CP="This is not a P3P policy! See https://en.wikipedia.org/wiki/Special:CentralAutoLogin/P3P for more info."`), [
		[["CP", "This is not a P3P policy! See https://en.wikipedia.org/wiki/Special:CentralAutoLogin/P3P for more info."]]
	]);
});
Deno.test("Permissions-Policy 1", { permissions: "none" }, () => {
	const sample = `fullscreen=(), camera=(), microphone=(), geolocation=(), interest-cohort=()`;
	deepStrictEqual(splitHTTPHeaderValueWithoutParameter(sample), [
		"fullscreen=()",
		"camera=()",
		"microphone=()",
		"geolocation=()",
		"interest-cohort=()"
	]);
	deepStrictEqual(splitHTTPHeaderValueWithParameter(sample), [
		[["fullscreen", "()"]],
		[["camera", "()"]],
		[["microphone", "()"]],
		[["geolocation", "()"]],
		[["interest-cohort", "()"]]
	]);
});
Deno.test("Prefer 1", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`return=representation`), [
		[["return", "representation"]]
	]);
});
Deno.test("Preference-Applied 1", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`return=representation`), [
		[["return", "representation"]]
	]);
});
Deno.test("Public-Key-Pins 1", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`max-age=2592000; pin-sha256="E9CZ9INDbd+2eRQozYqqbQ2yXLVKB9+xcprMF+44U1g="`), [
		[["max-age", "2592000"], ["pin-sha256", "E9CZ9INDbd+2eRQozYqqbQ2yXLVKB9+xcprMF+44U1g="]]
	]);
});
Deno.test("Refresh 1", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`5; url=http://www.w3.org/pub/WWW/People.html`), [
		["5", ["url", "http://www.w3.org/pub/WWW/People.html"]]
	]);
});
Deno.test("Report-To 1", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`{ "group": "csp-endpoint", "max_age": 10886400, "endpoints": [ { "url": "https-url-of-site-which-collects-reports" } ] }`), [
		[`{ "group": "csp-endpoint", "max_age": 10886400, "endpoints": [ { "url": "https-url-of-site-which-collects-reports" } ] }`]
	]);
});
Deno.test("Set-Cookie 1", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`CookieName=CookieValue; Max-Age=3600; Version=1`), [
		[["CookieName", "CookieValue"], ["Max-Age", "3600"], ["Version", "1"]]
	]);
});
Deno.test("Strict-Transport-Security 1", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValueWithParameter(`max-age=16070400; includeSubDomains`), [
		[["max-age", "16070400"], "includeSubDomains"]
	]);
});
Deno.test("Upgrade 1", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValueWithoutParameter(`h2c, HTTPS/1.3, IRC/6.9, RTA/x11, websocket`), [
		"h2c",
		"HTTPS/1.3",
		"IRC/6.9",
		"RTA/x11",
		"websocket"
	]);
});
Deno.test("Via 1", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValueWithoutParameter(`1.0 fred, 1.1 example.com (Apache/1.1)`), [
		"1.0 fred",
		"1.1 example.com (Apache/1.1)"
	]);
});
Deno.test("X-Forwarded-For 1", { permissions: "none" }, () => {
	deepStrictEqual(splitHTTPHeaderValueWithoutParameter(`client1, proxy1, proxy2`), [
		"client1",
		"proxy1",
		"proxy2"
	]);
});
