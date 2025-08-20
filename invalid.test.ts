import { throws } from "node:assert";
import { splitHTTPHeaderValue } from "./mod.ts";
Deno.test("1", { permissions: "none" }, () => {
	throws(() => {
		splitHTTPHeaderValue(`text/html, application/xhtml+xml, application/xml;q=0.9, image/webp, */*;q=0.8,`);
	});
});
