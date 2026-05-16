import { deepStrictEqual } from "node:assert";
import {
	decodeParameterValue,
	encodeParameterValue
} from "./mod.ts";
Deno.test("1", { permissions: "none" }, () => {
	const decoded = "€ rates";
	const encoded = "%E2%82%AC%20rates";
	deepStrictEqual(decodeParameterValue(`UTF-8'en'${encoded}`), {
		language: "en",
		value: decoded
	});
	deepStrictEqual(encodeParameterValue(decoded), `UTF-8''${encoded}`);
	deepStrictEqual(encodeParameterValue(decoded, "en"), `UTF-8'en'${encoded}`);
});
