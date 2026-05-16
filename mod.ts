import { isStringASCIIPrintable } from "https://raw.githubusercontent.com/hugoalh/is-string-ascii-es/v1.1.5/printable.ts";
export interface HTTPHeaderValueTransformOptions {
	/**
	 * When encounter an error, whether to throw the error instead of return the fallback value or original value.
	 * @default {true}
	 */
	strict?: boolean;
}
const internalTransformOptions: HTTPHeaderValueTransformOptions = {
	strict: false
};
//#region Encoding
const regexpParameterValueEncoded = /^[Uu][Tt][Ff]-?8'(?<language>.*?)'(?<encoded>.+)$/u;
export interface HTTPHeaderValueParameterValueDecodedContext {
	/**
	 * Language tag, according to the specification RFC 5646; However this value is never verified here and can be an arbitrary string.
	 */
	language?: string;
	value: string;
}
/**
 * Decode the HTTP header value parameter value, according to the specification RFC 8187.
 * @param {string} input The HTTP header value parameter value that need to decode.
 * @param {HTTPHeaderValueTransformOptions} [options={}] Options.
 * @returns {HTTPHeaderValueParameterValueDecodedContext} Context of the decoded HTTP header value parameter value.
 * @example
 * ```ts
 * decodeParameterValue("UTF-8'en'%E2%82%AC%20rates");
 * //=>
 * //  {
 * //    language: "en",
 * //    value: "€ rates"
 * //  }
 * ```
 */
export function decodeParameterValue(input: string, options: HTTPHeaderValueTransformOptions = {}): HTTPHeaderValueParameterValueDecodedContext {
	const { strict = true }: HTTPHeaderValueTransformOptions = options;
	const {
		encoded = "",
		language = ""
	} = input.match(regexpParameterValueEncoded)?.groups ?? {};
	if (
		!isStringASCIIPrintable(input) ||
		encoded.length === 0
	) {
		if (strict) {
			throw new SyntaxError(`\`${input}\` is not a valid encoded HTTP header value parameter value!`);
		}
		return { value: input };
	}
	const languageFmt: string = language.trim();
	return {
		language: (languageFmt.length === 0) ? undefined : languageFmt,
		value: decodeURIComponent(encoded)
	};
}
/**
 * Encode the HTTP header value parameter value, according to the specification RFC 8187.
 * @param {string} input The HTTP header value parameter value that need to encode.
 * @param {string} [languageCode=""] Language code of the HTTP header value parameter value.
 * @param {HTTPHeaderValueTransformOptions} [options={}] Options.
 * @returns {string} The encoded HTTP header value parameter value.
 * @example
 * ```ts
 * encodeParameterValue("€ rates");
 * //=> "UTF-8''%E2%82%AC%20rates"
 * ```
 * @example
 * ```ts
 * encodeParameterValue("€ rates", "en");
 * //=> "UTF-8'en'%E2%82%AC%20rates"
 * ```
 */
export function encodeParameterValue(input: string, languageCode: string = "", options: HTTPHeaderValueTransformOptions = {}): string {
	const { strict = true }: HTTPHeaderValueTransformOptions = options;
	if (isStringASCIIPrintable(input)) {
		if (strict) {
			throw new Error(`\`${input}\` is no need to be encoded HTTP header value parameter value!`);
		}
		return input;
	}
	if (!isStringASCIIPrintable(languageCode)) {
		if (strict) {
			throw new SyntaxError(`\`${languageCode}\` is not a valid HTTP header parameter value language code!`);
		}
		return input;
	}
	return `UTF-8'${languageCode}'${encodeURIComponent(input)}`;
}
//#endregion
//#region Utility
type BracketPair = readonly [open: string, close: string];
const brackets: readonly BracketPair[] = [
	["(", ")"],
	["<", ">"],
	["[", "]"],
	["{", "}"]
];
function isSeparator(character: string): boolean {
	return (
		character[0] === "," ||
		character[0] === ";" ||
		character[0] === "="
	);
}
function getDoubleQuotedLength(input: string): number {
	if (input[0] !== "\"") {
		return 0;
	}
	let cursor: number = 1;
	while (cursor < input.length) {
		if (input[cursor] === "\"" && input[cursor - 1] !== "\\") {
			return cursor + 1;
		}
		cursor += 1;
	}
	return 0;
}
/**
 * De-double-quote the text.
 * @param {string} input Text that need to de-double-quote.
 * @param {HTTPHeaderValueTransformOptions} [options={}] Options.
 * @returns {string} The de-double-quoted text.
 * @example
 * ```ts
 * deDoubleQuote(`"foobar"`);
 * //=> `foobar`
 * ```
 */
export function deDoubleQuote(input: string, options: HTTPHeaderValueTransformOptions = {}): string {
	const { strict = true }: HTTPHeaderValueTransformOptions = options;
	if (input.length === getDoubleQuotedLength(input)) {
		return JSON.parse(input) as string;
	}
	if (strict) {
		throw new Error(`\`${input}\` is no need to de-double-quote!`);
	}
	return input;
}
/**
 * En-double-quote the text.
 * @param {string} input Text that need to en-double-quote.
 * @param {HTTPHeaderValueTransformOptions} [options={}] Options.
 * @returns {string} The en-double-quoted text.
 */
export function enDoubleQuote(input: string, options: HTTPHeaderValueTransformOptions = {}): string {
	const { strict = true }: HTTPHeaderValueTransformOptions = options;
	if (
		input.includes("\n") ||
		input.includes("\v") ||
		input.includes("\f") ||
		input.includes("\r") ||
		input.includes(" ") ||
		input.includes("\"") ||
		input.includes(",") ||
		input.includes(";") ||
		input.includes("=")
	) {
		return JSON.stringify(input);
	}
	if (strict) {
		throw new Error(`\`${input}\` is no need to en-double-quote!`);
	}
	return input;
}
//#endregion
//#region Split
class HTTPHeaderValueSplitter {
	#index: number = 0;
	#input: string;
	constructor(input: string) {
		this.#input = input;
	}
	#getBracketedLengthSpecify(pair: BracketPair, index: number = this.#index): number {
		const [
			open,
			close
		]: BracketPair = pair;
		if (this.#input[index] !== open) {
			return 0;
		}
		let cursor: number = index + 1;
		let stack: number = 1;
		while (cursor < this.#input.length) {
			const lengthDoubleQuote: number = this.#getDoubleQuotedLength(cursor);
			if (lengthDoubleQuote > 0) {
				cursor += lengthDoubleQuote;
				continue;
			}
			if (this.#input[cursor] === open) {
				cursor += 1;
				stack += 1;
				continue;
			}
			if (this.#input[cursor] === close) {
				cursor += 1;
				stack -= 1;
				if (stack === 0) {
					return cursor - index;
				}
				continue;
			}
			cursor += 1;
		}
		return 0;
	}
	#getBracketedLengthAny(index: number = this.#index): number {
		return Math.max(...brackets.map((pair: BracketPair): number => {
			return this.#getBracketedLengthSpecify(pair, index);
		}));
	}
	#getDoubleQuotedLength(index: number = this.#index): number {
		if (this.#input[index] !== "\"") {
			return 0;
		}
		let cursor: number = index + 1;
		while (cursor < this.#input.length) {
			if (this.#input[cursor] === "\"" && this.#input[cursor - 1] !== "\\") {
				return cursor + 1 - index;
			}
			cursor += 1;
		}
		return 0;
	}
	#getText(index: number = this.#index): string {
		let cursor: number = index;
		while (cursor < this.#input.length) {
			if (isSeparator(this.#input[cursor])) {
				break;
			}
			const lengthBracket: number = this.#getBracketedLengthAny(cursor);
			if (lengthBracket > 0) {
				cursor += lengthBracket;
				continue;
			}
			const lengthQuote: number = this.#getDoubleQuotedLength(cursor);
			if (lengthQuote > 0) {
				cursor += lengthQuote;
				continue;
			}
			cursor += 1;
		}
		const value: string = this.#input.slice(this.#index, cursor).trimEnd();
		this.#index += value.length;
		return value;
	}
	#isSeparator(index: number = this.#index): boolean {
		return isSeparator(this.#input[index]);
	}
	#shiftIndexWhitespace(): void {
		const item: string = this.#input.slice(this.#index);
		this.#index += item.length - item.trimStart().length;
	}
	*split(): Generator<(string | HTTPHeaderValueParameterPair)[]> {
		this.#shiftIndexWhitespace();
		if (this.#isSeparator()) {
			throw new SyntaxError(`Unexpected HTTP header value separator \`${this.#input[this.#index]}\` at index ${this.#index}!`);
		}
		while (this.#index < this.#input.length) {
			const group: (string | HTTPHeaderValueParameterPair)[] = [];
			while (this.#index < this.#input.length) {
				const key: string = this.#getText();
				if (key.length === 0) {
					throw new SyntaxError(`Unexpected empty text at index ${this.#index}!`);
				}
				const keyFmt: string = deDoubleQuote(key, internalTransformOptions);
				this.#shiftIndexWhitespace();
				if (!(this.#index < this.#input.length)) {
					group.push(keyFmt);
					break;
				}
				if (!this.#isSeparator()) {
					throw new SyntaxError(`Unexpected character \`${this.#input[this.#index]}\` at index ${this.#index}!`);
				}
				if (this.#input[this.#index] === ",") {
					group.push(keyFmt);
					break;
				}
				if (this.#input[this.#index] === ";") {
					group.push(keyFmt);
					this.#index += 1;
					this.#shiftIndexWhitespace();
					if (!(this.#index < this.#input.length)) {
						throw new SyntaxError(`Unexpected end after HTTP header value separator \`;\` at index ${this.#index}!`);
					}
					continue;
				}
				this.#index += 1;
				this.#shiftIndexWhitespace();
				if (!(this.#index < this.#input.length)) {
					throw new SyntaxError(`Unexpected end after HTTP header value separator \`=\` at index ${this.#index}!`);
				}
				const value: string = this.#getText();
				if (value.length === 0) {
					throw new SyntaxError(`Unexpected empty text at index ${this.#index}!`);
				}
				const valueFmt: string = deDoubleQuote(value, internalTransformOptions);
				group.push([key, valueFmt]);
				this.#shiftIndexWhitespace();
				if (!(this.#index < this.#input.length)) {
					break;
				}
				if (!this.#isSeparator()) {
					throw new SyntaxError(`Unexpected character \`${this.#input[this.#index]}\` at index ${this.#index}!`);
				}
				if (this.#input[this.#index] === "=") {
					throw new SyntaxError(`Unexpected HTTP header value separator \`${this.#input[this.#index]}\` at index ${this.#index}!`);
				}
				if (this.#input[this.#index] === ",") {
					break;
				}
				this.#index += 1;
				this.#shiftIndexWhitespace();
				if (!(this.#index < this.#input.length)) {
					throw new SyntaxError(`Unexpected end after HTTP header value separator \`;\` at index ${this.#index}!`);
				}
			}
			if (group.length > 0) {
				yield group;
			}
			if (this.#input[this.#index] === ",") {
				this.#index += 1;
				this.#shiftIndexWhitespace();
				if (!(this.#index < this.#input.length)) {
					throw new SyntaxError(`Unexpected end after HTTP header value separator \`,\` at index ${this.#index}!`);
				}
			}
		}
	}
}
export type HTTPHeaderValueParameterPair = [key: string, value: string];
/**
 * Split the HTTP header value, in iterate.
 * @param {string} input HTTP header value that need to split.
 * @returns {Generator<(string | HTTPHeaderValueParameterPair)[]>}
 * @example
 * ```ts
 * Array.from(splitIterate(`br;q=1.0, gzip;q=0.8, *;q=0.1`));
 * //=>
 * //  [
 * //    ["br", ["q", "1.0"]],
 * //    ["gzip", ["q", "0.8"]],
 * //    ["*", ["q", "0.1"]]
 * //  ]
 * ```
 */
export function splitIterate(input: string): Generator<(string | HTTPHeaderValueParameterPair)[]> {
	return new HTTPHeaderValueSplitter(input).split();
}
/**
 * Split the HTTP header value.
 * @param {string} input HTTP header value that need to split.
 * @returns {(string | HTTPHeaderValueParameterPair)[][]}
 * @example
 * ```ts
 * split(`br;q=1.0, gzip;q=0.8, *;q=0.1`);
 * //=>
 * //  [
 * //    ["br", ["q", "1.0"]],
 * //    ["gzip", ["q", "0.8"]],
 * //    ["*", ["q", "0.1"]]
 * //  ]
 * ```
 */
export function split(input: string): (string | HTTPHeaderValueParameterPair)[][] {
	return Array.from(splitIterate(input));
}
//#endregion
//#region Parse
export interface HTTPHeaderValueOptions {
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
	parameters: Record<string, string>;
}
/**
 * Parse the HTTP header value, in iterate.
 * @param {string} input HTTP header value that need to parse.
 * @param {HTTPHeaderValueOptions} [options={}] Options.
 * @returns {Generator<HTTPHeaderValueElementContext>} Context of the HTTP header value.
 * @example
 * ```ts
 * Array.from(parseIterate(`br;q=1.0, gzip;q=0.8, *;q=0.1`));
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
export function* parseIterate(input: string, options: HTTPHeaderValueOptions = {}): Generator<HTTPHeaderValueElementContext> {
	const { parametersKeyCaseSensitive = false }: HTTPHeaderValueOptions = options;
	for (const group of splitIterate(input)) {
		const result: HTTPHeaderValueElementContext = {
			parameters: {}
		};
		for (let index: number = 0; index < group.length; index += 1) {
			const element: string | HTTPHeaderValueParameterPair = group[index];
			if (index === 0 && typeof element === "string") {
				result.value = element;
				continue;
			}
			let key: string;
			let value: string;
			if (typeof element === "string") {
				key = parametersKeyCaseSensitive ? element : element.toLowerCase();
				value = "";
			} else {
				key = parametersKeyCaseSensitive ? element[0] : element[0].toLowerCase();
				value = element[1];
			}
			if (key.endsWith("*")) {
				try {
					value = decodeParameterValue(value).value;
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
 * @param {HTTPHeaderValueOptions} [options={}] Options.
 * @returns {HTTPHeaderValueElementContext[]} Context of the HTTP header value.
 * @example
 * ```ts
 * parse(`br;q=1.0, gzip;q=0.8, *;q=0.1`);
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
export function parse(input: string, options: HTTPHeaderValueOptions = {}): HTTPHeaderValueElementContext[] {
	return Array.from(parseIterate(input, options));
}
//#endregion
//#region Stringify
function stringifyInternal(input: readonly (readonly (string | HTTPHeaderValueParameterPair)[])[]): string {
	return input.map((group: readonly (string | HTTPHeaderValueParameterPair)[]): string => {
		return group.map((element: string | HTTPHeaderValueParameterPair): string => {
			if (typeof element === "string") {
				return enDoubleQuote(element, internalTransformOptions);
			}
			const [
				key,
				value
			]: HTTPHeaderValueParameterPair = element;
			const valueFmt: string = encodeParameterValue(value, undefined, internalTransformOptions);
			return `${enDoubleQuote((valueFmt === value) ? key : `${key}*`, internalTransformOptions)}=${valueFmt}`;
		}).join("; ");
	}).join(", ");
}
/**
 * Stringify the HTTP header value from contexts.
 * @param {readonly HTTPHeaderValueElementContext[]} input Contexts.
 * @returns {string} A stringified HTTP header value.
 */
export function stringifyFromContexts(input: readonly HTTPHeaderValueElementContext[]): string {
	return stringifyInternal(input.map(({
		parameters,
		value
	}: HTTPHeaderValueElementContext, index: number): (string | HTTPHeaderValueParameterPair)[] => {
		if (Object.entries(parameters).length === 0 && (
			typeof value === "undefined" ||
			value.length === 0
		)) {
			throw new Error(`HTTPHeaderValueElementContext[${index}] is empty!`);
		}
		const result: (string | HTTPHeaderValueParameterPair)[] = [];
		if (typeof value !== "undefined") {
			result.push(value);
		}
		for (const [key, value] of Object.entries(parameters)) {
			if (key.length === 0) {
				throw new Error(`HTTPHeaderValueElementContext[${index}].key is empty!`);
			}
			result.push((value.length === 0) ? key : [key, value]);
		}
		return result;
	}));
}
/**
 * Stringify the HTTP header value from tokens.
 * @param {readonly HTTPHeaderValueElementContext[]} input Tokens.
 * @returns {string} A stringified HTTP header value.
 */
export function stringifyFromTokens(input: readonly (readonly (string | HTTPHeaderValueParameterPair)[])[]): string {
	for (let indexGroup: number = 0; indexGroup < input.length; indexGroup += 1) {
		const group: readonly (string | HTTPHeaderValueParameterPair)[] = input[indexGroup];
		if (group.length === 0) {
			throw new Error(`HTTPHeaderValueToken[${indexGroup}] is empty!`);
		}
		for (let indexElement: number = 0; indexElement < group.length; indexElement += 1) {
			const element: string | HTTPHeaderValueParameterPair = group[indexElement];
			if (typeof element === "string") {
				if (element.length === 0) {
					throw new Error(`HTTPHeaderValueToken[${indexGroup}][${indexElement}] is empty!`);
				}
			} else {
				if (!(Array.isArray(element) && element.length === 2)) {
					throw new Error(`HTTPHeaderValueToken[${indexGroup}][${indexElement}] is invalid!`);
				}
				if (element[0].length === 0) {
					throw new Error(`HTTPHeaderValueToken[${indexGroup}][${indexElement}].key is empty!`);
				}
			}
		}
	}
	return stringifyInternal(input);
}
//#endregion
