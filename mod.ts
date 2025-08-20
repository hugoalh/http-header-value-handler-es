type BracketPair = readonly [open: string, close: string];
const brackets: readonly BracketPair[] = [
	["(", ")"],
	["<", ">"],
	["[", "]"],
	["{", "}"]
];
function getTextLengthOfBracketSpecify(input: string, pair: BracketPair): number {
	const [
		open,
		close
	]: BracketPair = pair;
	if (input[0] !== open) {
		return 0;
	}
	let cursor: number = 1;
	let stack: number = 1;
	while (cursor < input.length) {
		const lengthQuote: number = getTextLengthOfQuote(input.slice(cursor));
		if (lengthQuote > 0) {
			cursor += lengthQuote;
			continue;
		}
		if (input[cursor] === open) {
			cursor += 1;
			stack += 1;
			continue;
		}
		if (input[cursor] === close) {
			cursor += 1;
			stack -= 1;
			if (stack === 0) {
				return cursor;
			}
			continue;
		}
		cursor += 1;
	}
	return 0;
}
function getTextLengthOfBracketAny(input: string): number {
	return Math.max(...brackets.map((pair: BracketPair): number => {
		return getTextLengthOfBracketSpecify(input, pair);
	}));
}
function getTextLengthOfQuote(input: string): number {
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
function getTextLength(input: string): number {
	let cursor: number = 0;
	while (cursor < input.length) {
		if (isSeparator(input[cursor])) {
			break;
		}
		const lengthBracket: number = getTextLengthOfBracketAny(input.slice(cursor));
		if (lengthBracket > 0) {
			cursor += lengthBracket;
			continue;
		}
		const lengthQuote: number = getTextLengthOfQuote(input.slice(cursor));
		if (lengthQuote > 0) {
			cursor += lengthQuote;
			continue;
		}
		cursor += 1;
	}
	return input.slice(0, cursor).trimEnd().length;
}
function getLengthWhitespace(input: string): number {
	return (input.length - input.trimStart().length);
}
function isSeparator(character: string): boolean {
	return (
		character[0] === "," ||
		character[0] === ";" ||
		character[0] === "="
	);
}
/**
 * De-quote the double quoted text, if possible.
 * @example
 * ```ts
 * deQuoteSafe(`"foobar"`);
 * //=> `foobar`
 * ```
 * @example
 * ```ts
 * deQuoteSafe(`foobar`);
 * //=> `foobar`
 * ```
 */
function deQuoteSafe(input: string): string {
	if (getTextLengthOfQuote(input) === input.length) {
		return JSON.parse(input) as string;
	}
	return input;
}
/**
 * En-quote the text with double quote, if need.
 */
function enQuoteOnDemand(input: string): string {
	if (
		input.includes("\"") ||
		input.includes(",") ||
		input.includes(";") ||
		input.includes("=")
	) {
		return JSON.stringify(input);
	}
	return input;
}
/**
 * Token for parameter of the HTTP header value.
 */
export type HTTPHeaderValueTokenParameter = [key: string, value: string];
function* splitHTTPHeaderValueInternal(input: string): Generator<(string | HTTPHeaderValueTokenParameter)[]> {
	let index: number = getLengthWhitespace(input);
	if (isSeparator(input[index])) {
		throw new SyntaxError(`Unexpected separator character \`${input[index]}\` at index ${index}!`);
	}
	while (index < input.length) {
		const group: (string | HTTPHeaderValueTokenParameter)[] = [];
		while (index < input.length) {
			const keyLength: number = getTextLength(input.slice(index));
			if (keyLength === 0) {
				throw new SyntaxError(`Unexpected empty at index ${index}!`);
			}
			const key: string = deQuoteSafe(input.slice(index, index + keyLength));
			index += keyLength;
			index += getLengthWhitespace(input.slice(index));
			if (!(index < input.length)) {
				group.push(key);
				break;
			}
			if (!isSeparator(input[index])) {
				throw new SyntaxError(`Unexpected character \`${input[index]}\` at index ${index}!`);
			}
			if (input[index] === ",") {
				group.push(key);
				break;
			}
			if (input[index] === ";") {
				group.push(key);
				index += 1;
				index += getLengthWhitespace(input.slice(index));
				if (!(index < input.length)) {
					throw new SyntaxError(`Unexpected end of HTTP header value after separator \`;\` at index ${index}!`);
				}
				continue;
			}
			index += 1;
			index += getLengthWhitespace(input.slice(index));
			if (!(index < input.length)) {
				throw new SyntaxError(`Unexpected end of HTTP header value after separator \`=\` at index ${index}!`);
			}
			const valueLength: number = getTextLength(input.slice(index));
			if (valueLength === 0) {
				throw new SyntaxError(`Unexpected empty at index ${index}!`);
			}
			const value: string = deQuoteSafe(input.slice(index, index + valueLength));
			index += valueLength;
			group.push([key, value]);
			index += getLengthWhitespace(input.slice(index));
			if (!(index < input.length)) {
				break;
			}
			if (!isSeparator(input[index])) {
				throw new SyntaxError(`Unexpected character \`${input[index]}\` at index ${index}!`);
			}
			if (input[index] === "=") {
				throw new SyntaxError(`Unexpected separator character \`${input[index]}\` at index ${index}!`);
			}
			if (input[index] === ",") {
				break;
			}
			index += 1;
			index += getLengthWhitespace(input.slice(index));
			if (!(index < input.length)) {
				throw new SyntaxError(`Unexpected end of HTTP header value after separator \`;\` at index ${index}!`);
			}
		}
		if (group.length > 0) {
			yield group;
		}
		if (input[index] === ",") {
			index += 1;
			index += getLengthWhitespace(input.slice(index));
			if (!(index < input.length)) {
				throw new SyntaxError(`Unexpected end of HTTP header value after separator \`,\` at index ${index}!`);
			}
		}
	}
}
/**
 * Split the HTTP header value.
 * @param {string} input HTTP header value that need to split.
 * @returns {(string | HTTPHeaderValueTokenParameter)[][]}
 * @example
 * ```ts
 * splitHTTPHeaderValue(`br;q=1.0, gzip;q=0.8, *;q=0.1`);
 * /*=>
 * [
 *   ["br", ["q", "1.0"]],
 *   ["gzip", ["q", "0.8"]],
 *   ["*", ["q", "0.1"]]
 * ]
 * ```
 */
export function splitHTTPHeaderValue(input: string): (string | HTTPHeaderValueTokenParameter)[][] {
	return Array.from(splitHTTPHeaderValueInternal(input));
}
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
 * Parse the HTTP header value.
 * @param {string} input HTTP header value that need to parse.
 * @param {HTTPHeaderValueOptions} [options={}] Options.
 * @returns {HTTPHeaderValueElementContext[]} Context of the HTTP header value.
 * @example
 * ```ts
 * parseHTTPHeaderValue(`br;q=1.0, gzip;q=0.8, *;q=0.1`);
 * /*=>
 * [
 *   {
 *     value: "br",
 *     parameters: {
 *       q: "1.0"
 *     }
 *   },
 *   {
 *     value: "gzip",
 *     parameters: {
 *       q: "0.8"
 *     }
 *   },
 *   {
 *     value: "*",
 *     parameters: {
 *       q: "0.1"
 *     }
 *   }
 * ]
 * ```
 */
export function parseHTTPHeaderValue(input: string, options: HTTPHeaderValueOptions = {}): HTTPHeaderValueElementContext[] {
	const { parametersKeyCaseSensitive = false }: HTTPHeaderValueOptions = options;
	return Array.from(splitHTTPHeaderValueInternal(input), (group: (string | HTTPHeaderValueTokenParameter)[]): HTTPHeaderValueElementContext => {
		const result: HTTPHeaderValueElementContext = {
			parameters: {}
		};
		for (let index: number = 0; index < group.length; index += 1) {
			const element: string | HTTPHeaderValueTokenParameter = group[index];
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
			if (typeof result.parameters[key] !== "undefined") {
				throw new SyntaxError(`Parameter key \`${key}\` is duplicated!`);
			}
			result.parameters[key] = value;
		}
		return result;
	});
}
function stringifyHTTPHeaderValueInternal(input: readonly (readonly (string | HTTPHeaderValueTokenParameter)[])[]): string {
	return input.map((group: readonly (string | HTTPHeaderValueTokenParameter)[]): string => {
		return group.map((element: string | HTTPHeaderValueTokenParameter): string => {
			return ((typeof element === "string") ? enQuoteOnDemand(element) : `${enQuoteOnDemand(element[0])}=${enQuoteOnDemand(element[1])}`);
		}).join("; ");
	}).join(", ");
}
/**
 * Stringify the HTTP header value from contexts.
 * @param {readonly HTTPHeaderValueElementContext[]} input Contexts.
 * @returns {string} A stringified HTTP header value.
 */
export function stringifyHTTPHeaderValueFromContexts(input: readonly HTTPHeaderValueElementContext[]): string {
	return stringifyHTTPHeaderValueInternal(input.map(({
		parameters,
		value
	}: HTTPHeaderValueElementContext, index: number): (string | HTTPHeaderValueTokenParameter)[] => {
		if (Object.entries(parameters).length === 0 && (
			typeof value === "undefined" ||
			value.length === 0
		)) {
			throw new Error(`HTTPHeaderValueElementContext[${index}] is empty!`);
		}
		const result: (string | HTTPHeaderValueTokenParameter)[] = [];
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
export function stringifyHTTPHeaderValueFromTokens(input: readonly (readonly (string | HTTPHeaderValueTokenParameter)[])[]): string {
	for (let indexGroup: number = 0; indexGroup < input.length; indexGroup += 1) {
		const group: readonly (string | HTTPHeaderValueTokenParameter)[] = input[indexGroup];
		if (group.length === 0) {
			throw new Error(`HTTPHeaderValueToken[${indexGroup}] is empty!`);
		}
		for (let indexElement: number = 0; indexElement < group.length; indexElement += 1) {
			const element: string | HTTPHeaderValueTokenParameter = group[indexElement];
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
	return stringifyHTTPHeaderValueInternal(input);
}
