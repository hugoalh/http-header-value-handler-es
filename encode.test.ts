import { deepStrictEqual } from "node:assert";
import {
	decodeHTTPHeaderParameterValue,
	encodeHTTPHeaderParameterValueOnNeed
} from "./mod.ts";
Deno.test("1", { permissions: "none" }, () => {
	const decoded = "€ rates";
	const encoded = "%E2%82%AC%20rates";
	deepStrictEqual(decodeHTTPHeaderParameterValue(`UTF-8'en'${encoded}`), decoded);
	deepStrictEqual(encodeHTTPHeaderParameterValueOnNeed(decoded), {
		encoded: true,
		value: `UTF-8''${encoded}`
	});
	deepStrictEqual(encodeHTTPHeaderParameterValueOnNeed(decoded, "en"), {
		encoded: true,
		value: `UTF-8'en'${encoded}`
	});
});
