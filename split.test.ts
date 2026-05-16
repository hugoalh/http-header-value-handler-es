import {
	deepStrictEqual,
	throws
} from "node:assert";
import { split } from "./mod.ts";
Deno.test("Accept 1", { permissions: "none" }, () => {
	const result = [
		["text/html"],
		["application/xhtml+xml"],
		["application/xml", ["q", "0.9"]],
		["image/webp"],
		["*/*", ["q", "0.8"]]
	];
	deepStrictEqual(split(`text/html, application/xhtml+xml, application/xml;q=0.9, image/webp, */*;q=0.8`), result);
	deepStrictEqual(split(` text/html , application/xhtml+xml , application/xml ; q = 0.9 , image/webp , */*; q = 0.8 `), result);
});
Deno.test("Accept 2", { permissions: "none" }, () => {
	const result = [
		["*/*"]
	];
	deepStrictEqual(split(`*/*`), result);
	deepStrictEqual(split(` */* `), result);
});
Deno.test("Accept 3", { permissions: "none" }, () => {
	const result = [
		["text/html"],
		["application/xhtml+xml"],
		["application/xml", ["q", "0.9"]],
		["*/*", ["q", "0.8"]]
	];
	deepStrictEqual(split(`text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8`), result);
	deepStrictEqual(split(` text/html , application/xhtml+xml , application/xml ; q = 0.9 , */* ; q = 0.8 `), result);
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
	deepStrictEqual(split(`image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5`), result);
	deepStrictEqual(split(` image/avif , image/webp , image/png , image/svg+xml , image/* ; q = 0.8 , */* ; q = 0.5 `), result);
});
Deno.test("Accept 5", { permissions: "none" }, () => {
	const result = [
		["application/json"]
	];
	deepStrictEqual(split(`application/json`), result);
	deepStrictEqual(split(` application/json `), result);
});
Deno.test("Accept-CH 1", { permissions: "none" }, () => {
	const result = [
		["Viewport-Width"],
		["Width"]
	];
	deepStrictEqual(split(`Viewport-Width, Width`), result);
	deepStrictEqual(split(` Viewport-Width , Width `), result);
});
Deno.test("Accept-Encoding 1", { permissions: "none" }, () => {
	const result = [
		["gzip"],
		["deflate"]
	];
	deepStrictEqual(split(`gzip, deflate`), result);
	deepStrictEqual(split(` gzip , deflate `), result);
});
Deno.test("Accept-Encoding 2", { permissions: "none" }, () => {
	const result = [
		["deflate"],
		["gzip", ["q", "1.0"]],
		["*", ["q", "0.5"]]
	];
	deepStrictEqual(split(`deflate, gzip;q=1.0, *;q=0.5`), result);
	deepStrictEqual(split(` deflate , gzip ; q = 1.0 , * ; q = 0.5 `), result);
});
Deno.test("Accept-Encoding 3", { permissions: "none" }, () => {
	const result = [
		["gzip"],
		["deflate"],
		["br"],
		["zstd"]
	];
	deepStrictEqual(split(`gzip, deflate, br, zstd`), result);
	deepStrictEqual(split(` gzip , deflate , br , zstd `), result);
});
Deno.test("Accept-Encoding 4", { permissions: "none" }, () => {
	const result = [
		["br", ["q", "1.0"]],
		["gzip", ["q", "0.8"]],
		["*", ["q", "0.1"]]
	];
	deepStrictEqual(split(`br;q=1.0, gzip;q=0.8, *;q=0.1`), result);
	deepStrictEqual(split(` br ; q = 1.0 , gzip ; q = 0.8 , * ; q = 0.1 `), result);
});
Deno.test("Accept-Language 1", { permissions: "none" }, () => {
	const result = [
		["de", ["q", "1.0"]],
		["en", ["q", "0.5"]]
	];
	deepStrictEqual(split(`de; q=1.0, en; q=0.5`), result);
	deepStrictEqual(split(` de ; q = 1.0 , en ; q = 0.5 `), result);
});
Deno.test("Accept-Language 2", { permissions: "none" }, () => {
	const result = [
		["fr-CH"],
		["fr", ["q", "0.9"]],
		["en", ["q", "0.8"]],
		["de", ["q", "0.7"]],
		["*", ["q", "0.5"]]
	];
	deepStrictEqual(split(`fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5`), result);
	deepStrictEqual(split(` fr-CH , fr ; q = 0.9 , en ; q = 0.8 , de ; q = 0.7 , * ; q = 0.5 `), result);
});
Deno.test("Accept-Patch 1", { permissions: "none" }, () => {
	const result = [
		["text/plain", ["charset", "utf-8"]]
	];
	deepStrictEqual(split(`text/plain;charset=utf-8`), result);
	deepStrictEqual(split(` text/plain ; charset = utf-8 `), result);
});
Deno.test("Alt-Svc 1", { permissions: "none" }, () => {
	const result = [
		[["http/1.1", "http2.example.com:8001"], ["ma", "7200"]]
	];
	deepStrictEqual(split(`http/1.1="http2.example.com:8001"; ma=7200`), result);
	deepStrictEqual(split(` http/1.1 = "http2.example.com:8001" ; ma = 7200 `), result);
});
Deno.test("Content-Disposition 1", { permissions: "none" }, () => {
	const result = [
		["attachment", ["filename", "fname.ext"]]
	];
	deepStrictEqual(split(`attachment; filename="fname.ext"`), result);
	deepStrictEqual(split(` attachment ; filename = "fname.ext" `), result);
});
Deno.test("Content-Type 1", { permissions: "none" }, () => {
	const example = [
		["text/html", ["charset", "utf-8"]]
	];
	deepStrictEqual(split(`text/html; charset=utf-8`), example);
	deepStrictEqual(split(` text/html ; charset = utf-8 `), example);
});
Deno.test("Cookie 1", { permissions: "none" }, () => {
	const result = [
		[["$Version", "1"], ["Skin", "new"]]
	];
	deepStrictEqual(split(`\$Version=1; Skin=new`), result);
	deepStrictEqual(split(` \$Version = 1 ; Skin = new `), result);
});
Deno.test("Expect-CT 1", { permissions: "none" }, () => {
	const result = [
		[["max-age", "604800"]],
		["enforce"],
		[["report-uri", "https://example.example/report"]]
	];
	deepStrictEqual(split(`max-age=604800, enforce, report-uri="https://example.example/report"`), result);
	deepStrictEqual(split(` max-age = 604800 , enforce , report-uri = "https://example.example/report" `), result);
});
Deno.test("Forwarded 1", { permissions: "none" }, () => {
	const result = [
		[["for", "192.0.2.60"], ["proto", "http"], ["by", "203.0.113.43"]]
	];
	deepStrictEqual(split(`for=192.0.2.60;proto=http;by=203.0.113.43`), result);
	deepStrictEqual(split(` for = 192.0.2.60 ; proto = http ; by = 203.0.113.43 `), result);
});
Deno.test("Forwarded 2", { permissions: "none" }, () => {
	const result = [
		[["for", "192.0.2.43"]],
		[["for", "198.51.100.17"]]
	];
	deepStrictEqual(split(`for=192.0.2.43, for=198.51.100.17`), result);
	deepStrictEqual(split(` for = 192.0.2.43 , for = 198.51.100.17 `), result);
});
Deno.test("Link 1", { permissions: "none" }, () => {
	deepStrictEqual(split(`</feed>; rel="alternate"`), [
		["</feed>", ["rel", "alternate"]]
	]);
});
Deno.test("Link 2", { permissions: "none" }, () => {
	deepStrictEqual(split(`<https://example.com>; rel="preconnect"`), [
		["<https://example.com>", ["rel", "preconnect"]]
	]);
});
Deno.test("Link 3", { permissions: "none" }, () => {
	deepStrictEqual(split(`https://bad.example; rel="preconnect"`), [
		["https://bad.example", ["rel", "preconnect"]]
	]);
});
Deno.test("Link 4", { permissions: "none" }, () => {
	deepStrictEqual(split(`<https://example.com/%E8%8B%97%E6%9D%A1>; rel="preconnect"`), [
		["<https://example.com/%E8%8B%97%E6%9D%A1>", ["rel", "preconnect"]]
	]);
});
Deno.test("Link 5", { permissions: "none" }, () => {
	deepStrictEqual(split(`<https://example.com/苗条>; rel="preconnect"`), [
		["<https://example.com/苗条>", ["rel", "preconnect"]]
	]);
});
Deno.test("Link 6", { permissions: "none" }, () => {
	deepStrictEqual(split(`<https://one.example.com>; rel="preconnect", <https://two.example.com>; rel="preconnect", <https://three.example.com>; rel="preconnect"`), [
		["<https://one.example.com>", ["rel", "preconnect"]],
		["<https://two.example.com>", ["rel", "preconnect"]],
		["<https://three.example.com>", ["rel", "preconnect"]]
	]);
});
Deno.test("Link 7", { permissions: "none" }, () => {
	deepStrictEqual(split(`<https://api.example.com/issues?page=2>; rel="prev", <https://api.example.com/issues?page=4>; rel="next", <https://api.example.com/issues?page=10>; rel="last", <https://api.example.com/issues?page=1>; rel="first"`), [
		["<https://api.example.com/issues?page=2>", ["rel", "prev"]],
		["<https://api.example.com/issues?page=4>", ["rel", "next"]],
		["<https://api.example.com/issues?page=10>", ["rel", "last"]],
		["<https://api.example.com/issues?page=1>", ["rel", "first"]]
	]);
});
Deno.test("Link 8", { permissions: "none" }, () => {
	deepStrictEqual(split(`</style.css>; rel=preload; as=style; fetchpriority="high"`), [
		["</style.css>", ["rel", "preload"], ["as", "style"], ["fetchpriority", "high"]]
	]);
});
Deno.test("NEL 1", { permissions: "none" }, () => {
	deepStrictEqual(split(`{ "report_to": "name_of_reporting_group", "max_age": 12345, "include_subdomains": false, "success_fraction": 0.0, "failure_fraction": 1.0 }`), [
		[`{ "report_to": "name_of_reporting_group", "max_age": 12345, "include_subdomains": false, "success_fraction": 0.0, "failure_fraction": 1.0 }`]
	]);
});
Deno.test("P3P 1", { permissions: "none" }, () => {
	deepStrictEqual(split(`CP="This is not a P3P policy! See https://en.wikipedia.org/wiki/Special:CentralAutoLogin/P3P for more info."`), [
		[["CP", "This is not a P3P policy! See https://en.wikipedia.org/wiki/Special:CentralAutoLogin/P3P for more info."]]
	]);
});
Deno.test("Permissions-Policy 1", { permissions: "none" }, () => {
	deepStrictEqual(split(`fullscreen=(), camera=(), microphone=(), geolocation=(), interest-cohort=()`), [
		[["fullscreen", "()"]],
		[["camera", "()"]],
		[["microphone", "()"]],
		[["geolocation", "()"]],
		[["interest-cohort", "()"]]
	]);
});
Deno.test("Prefer 1", { permissions: "none" }, () => {
	deepStrictEqual(split(`return=representation`), [
		[["return", "representation"]]
	]);
});
Deno.test("Preference-Applied 1", { permissions: "none" }, () => {
	deepStrictEqual(split(`return=representation`), [
		[["return", "representation"]]
	]);
});
Deno.test("Public-Key-Pins 1", { permissions: "none" }, () => {
	deepStrictEqual(split(`max-age=2592000; pin-sha256="E9CZ9INDbd+2eRQozYqqbQ2yXLVKB9+xcprMF+44U1g="`), [
		[["max-age", "2592000"], ["pin-sha256", "E9CZ9INDbd+2eRQozYqqbQ2yXLVKB9+xcprMF+44U1g="]]
	]);
});
Deno.test("Refresh 1", { permissions: "none" }, () => {
	deepStrictEqual(split(`5; url=http://www.w3.org/pub/WWW/People.html`), [
		["5", ["url", "http://www.w3.org/pub/WWW/People.html"]]
	]);
});
Deno.test("Report-To 1", { permissions: "none" }, () => {
	deepStrictEqual(split(`{ "group": "csp-endpoint", "max_age": 10886400, "endpoints": [ { "url": "https-url-of-site-which-collects-reports" } ] }`), [
		[`{ "group": "csp-endpoint", "max_age": 10886400, "endpoints": [ { "url": "https-url-of-site-which-collects-reports" } ] }`]
	]);
});
Deno.test("Set-Cookie 1", { permissions: "none" }, () => {
	deepStrictEqual(split(`CookieName=CookieValue; Max-Age=3600; Version=1`), [
		[["CookieName", "CookieValue"], ["Max-Age", "3600"], ["Version", "1"]]
	]);
});
Deno.test("Strict-Transport-Security 1", { permissions: "none" }, () => {
	deepStrictEqual(split(`max-age=16070400; includeSubDomains`), [
		[["max-age", "16070400"], "includeSubDomains"]
	]);
});
Deno.test("Upgrade 1", { permissions: "none" }, () => {
	deepStrictEqual(split(`h2c, HTTPS/1.3, IRC/6.9, RTA/x11, websocket`), [
		["h2c"],
		["HTTPS/1.3"],
		["IRC/6.9"],
		["RTA/x11"],
		["websocket"]
	]);
});
Deno.test("Via 1", { permissions: "none" }, () => {
	deepStrictEqual(split(`1.0 fred, 1.1 example.com (Apache/1.1)`), [
		["1.0 fred"],
		["1.1 example.com (Apache/1.1)"]
	]);
});
Deno.test("X-Forwarded-For 1", { permissions: "none" }, () => {
	deepStrictEqual(split(`client1, proxy1, proxy2`), [
		["client1"],
		["proxy1"],
		["proxy2"]
	]);
});
Deno.test("Invalid 1", { permissions: "none" }, () => {
	throws(() => {
		split(`text/html, application/xhtml+xml, application/xml;q=0.9, image/webp, */*;q=0.8,`);
	});
});
