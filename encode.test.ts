import { deepStrictEqual } from "node:assert";
import {
	decodeHTTPHeaderValueParameterValue,
	encodeHTTPHeaderValueParameterValue
} from "./encode.ts";
Deno.test("1", { permissions: "none" }, () => {
	const decoded = "€ rates";
	const encoded = "%E2%82%AC%20rates";
	deepStrictEqual(decodeHTTPHeaderValueParameterValue(`UTF-8'en'${encoded}`), {
		language: "en",
		value: decoded
	});
	deepStrictEqual(encodeHTTPHeaderValueParameterValue(decoded), `UTF-8''${encoded}`);
	deepStrictEqual(encodeHTTPHeaderValueParameterValue(decoded, "en"), `UTF-8'en'${encoded}`);
});
