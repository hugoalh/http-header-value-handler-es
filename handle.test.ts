import { deepStrictEqual } from "node:assert";
import { stringifyHTTPHeaderValue } from "./handle.ts";
Deno.test("Stringify 1", { permissions: "none" }, () => {
	deepStrictEqual(stringifyHTTPHeaderValue([{ value: "<https://one.example.com>", parameters: { rel: "preconnect" } }]), `<https://one.example.com>; rel=preconnect`);
});
