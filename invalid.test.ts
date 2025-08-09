import { throws } from "node:assert";
import { splitHTTPHeaderValueWithParameter } from "./mod.ts";
Deno.test("1", { permissions: "none" }, () => {
	throws(() => {
		splitHTTPHeaderValueWithParameter(`text/html, application/xhtml+xml, application/xml;q=0.9, image/webp, */*;q=0.8,`);
	});
});
