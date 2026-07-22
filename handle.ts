import {
	decodeHTTPHeaderValueParameterValue,
	encodeHTTPHeaderValueParameterValueNonStrict
} from "./encode.ts";
import { enDoubleQuoteNonStrict } from "./quote.ts";
import {
	splitHTTPHeaderValueIterate,
	type HTTPHeaderValueParameterPair
} from "./split.ts";
export type { HTTPHeaderValueParameterPair } from "./split.ts";
export interface HTTPHeaderValueHandlerOptions {
	/**
	 * Whether the parameters key are case sensitive. Few of the HTTP headers value accept case sensitive parameters key.
	 * 
	 * If this property is defined to `false`, the parameters key are all convert to lower case.
	 * @default {false}
	 */
	parametersKeyCaseSensitive?: boolean;
}
/**
 * Element context of the HTTP header value.
 */
export interface HTTPHeaderValueElementContext {
	value?: string;
	parameters: Record<string, string | undefined>;
}
/**
 * Parse the HTTP header value, in iterate.
 * @param {string} input HTTP header value that need to parse.
 * @param {HTTPHeaderValueHandlerOptions} [options={}] Options.
 * @returns {Generator<HTTPHeaderValueElementContext>} Context of the HTTP header value.
 * @example
 * ```ts
 * Array.from(parseHTTPHeaderValueIterate(`br;q=1.0, gzip;q=0.8, *;q=0.1`));
 * //=>
 * //  [
 * //    {
 * //      value: "br",
 * //      parameters: {
 * //        q: "1.0"
 * //      }
 * //    },
 * //    {
 * //      value: "gzip",
 * //      parameters: {
 * //        q: "0.8"
 * //      }
 * //    },
 * //    {
 * //      value: "*",
 * //      parameters: {
 * //        q: "0.1"
 * //      }
 * //    }
 * //  ]
 * ```
 */
export function* parseHTTPHeaderValueIterate(input: string, options: HTTPHeaderValueHandlerOptions = {}): Generator<HTTPHeaderValueElementContext> {
	const { parametersKeyCaseSensitive = false }: HTTPHeaderValueHandlerOptions = options;
	for (const [
		groupFirst,
		...groupRest
	] of splitHTTPHeaderValueIterate(input)) {
		const result: HTTPHeaderValueElementContext = {
			parameters: {}
		};
		if (typeof groupFirst === "string") {
			result.value = groupFirst;
		}
		for (const element of ((typeof groupFirst === "string") ? groupRest : [groupFirst, ...groupRest])) {
			let key: string;
			let value: string;
			if (typeof element === "string") {
				key = element;
				value = "";
			} else {
				key = element.key;
				value = element.value;
			}
			key = parametersKeyCaseSensitive ? key : key.toLowerCase();
			if (key.endsWith("*")) {
				try {
					value = decodeHTTPHeaderValueParameterValue(value).value;
				} catch {
					throw new SyntaxError(`Parameter \`${key}=${value}\` is not a valid encoded HTTP header parameter!`);
				}
				key = key.slice(0, key.length - 1);
			} else {
				if (typeof result.parameters[key] !== "undefined") {
					throw new SyntaxError(`Parameter key \`${key}\` is duplicated!`);
				}
			}
			result.parameters[key] = value;
		}
		yield result;
	}
}
/**
 * Parse the HTTP header value.
 * @param {string} input HTTP header value that need to parse.
 * @param {HTTPHeaderValueHandlerOptions} [options={}] Options.
 * @returns {HTTPHeaderValueElementContext[]} Context of the HTTP header value.
 * @example
 * ```ts
 * parseHTTPHeaderValue(`br;q=1.0, gzip;q=0.8, *;q=0.1`);
 * //=>
 * //  [
 * //    {
 * //      value: "br",
 * //      parameters: {
 * //        q: "1.0"
 * //      }
 * //    },
 * //    {
 * //      value: "gzip",
 * //      parameters: {
 * //        q: "0.8"
 * //      }
 * //    },
 * //    {
 * //      value: "*",
 * //      parameters: {
 * //        q: "0.1"
 * //      }
 * //    }
 * //  ]
 * ```
 */
export function parseHTTPHeaderValue(input: string, options: HTTPHeaderValueHandlerOptions = {}): HTTPHeaderValueElementContext[] {
	return Array.from(parseHTTPHeaderValueIterate(input, options));
}
function stringifyHTTPHeaderValueInternal(input: readonly (readonly (string | HTTPHeaderValueParameterPair)[])[], options: HTTPHeaderValueHandlerOptions = {}): string {
	const { parametersKeyCaseSensitive = false }: HTTPHeaderValueHandlerOptions = options;
	return input.map((group: readonly (string | HTTPHeaderValueParameterPair)[], indexGroup: number): string => {
		return group.map((element: string | HTTPHeaderValueParameterPair, indexElement: number): string => {
			if (typeof element === "string") {
				if (element.length === 0) {
					throw new Error(`Parameter \`input[${indexGroup}][${indexElement}]\` is empty!`);
				}
				return (enDoubleQuoteNonStrict(element) ?? element);
			}
			const {
				key,
				value
			}: HTTPHeaderValueParameterPair = element;
			if (key.length === 0) {
				throw new Error(`Parameter \`input[${indexGroup}][${indexElement}].key\` is empty!`);
			}
			const keyFmt = parametersKeyCaseSensitive ? key : key.toLowerCase();
			if (value.length === 0) {
				return (`${enDoubleQuoteNonStrict(keyFmt) ?? keyFmt}`);
			}
			const valueFmt: string | null = encodeHTTPHeaderValueParameterValueNonStrict(value);
			if (valueFmt === null) {
				return `${enDoubleQuoteNonStrict(keyFmt)}=${value}`;
			}
			return `${enDoubleQuoteNonStrict(`${keyFmt}*`)}=${valueFmt}`;
		}).filter((element: string): boolean => {
			return (element.length > 0);
		}).join("; ");
	}).filter((group: string): boolean => {
		return (group.length > 0);
	}).join(", ");
}
/**
 * Stringify the HTTP header value.
 * @param {readonly HTTPHeaderValueElementContext[] | readonly (readonly (string | HTTPHeaderValueParameterPair)[])[]} input HTTP header value that need to stringify.
 * @param {HTTPHeaderValueHandlerOptions} [options={}] Options.
 * @returns {string} A stringified HTTP header value.
 */
export function stringifyHTTPHeaderValue(input: readonly HTTPHeaderValueElementContext[] | readonly (readonly (string | HTTPHeaderValueParameterPair)[])[], options: HTTPHeaderValueHandlerOptions = {}): string {
	if (input.every((group: HTTPHeaderValueElementContext | readonly (string | HTTPHeaderValueParameterPair)[]): group is HTTPHeaderValueElementContext => {
		return !Array.isArray(group);
	})) {
		return stringifyHTTPHeaderValueInternal(input.map((group: HTTPHeaderValueElementContext): readonly (string | HTTPHeaderValueParameterPair)[] => {
			const result: (string | HTTPHeaderValueParameterPair)[] = [];
			if (typeof group.value !== "undefined") {
				result.push(group.value);
			}
			for (const [
				key,
				value
			] of Object.entries(group.parameters)) {
				result.push({
					key,
					value: value ?? ""
				});
			}
			return result;
		}), options);
	}
	return stringifyHTTPHeaderValueInternal(input, options);
}
