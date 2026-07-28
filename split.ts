import { deDoubleQuoteNonStrict } from "./quote.ts";
interface BracketPair {
	open: string;
	close: string;
}
const brackets: readonly BracketPair[] = [/* UNIQUE */
	{ open: "(", close: ")" },
	{ open: "<", close: ">" },
	{ open: "[", close: "]" },
	{ open: "{", close: "}" }
];
function isCharacterSeparator(character: string): boolean {
	return (
		character === "," ||
		character === ";" ||
		character === "="
	);
}
export interface HTTPHeaderValueParameterPair {
	key: string;
	value: string;
}
/**
 * Split the HTTP header value, in iterate.
 * @param {string} input HTTP header value that need to split.
 * @returns {Generator<(string | HTTPHeaderValueParameterPair)[]>}
 * @example
 * ```ts
 * Array.from(splitHTTPHeaderValueIterate(`br;q=1.0, gzip;q=0.8, *;q=0.1`));
 * //=>
 * //  [
 * //    ["br", { key: "q", value: "1.0" }],
 * //    ["gzip", { key: "q", value: "0.8" }],
 * //    ["*", { key: "q", value: "0.1" }]
 * //  ]
 * ```
 */
export function* splitHTTPHeaderValueIterate(input: string): Generator<(string | HTTPHeaderValueParameterPair)[]> {
	let index: number = 0;
	function getBracketedLengthSpecify(pair: BracketPair, indexAt: number = index): number {
		const {
			open,
			close
		}: BracketPair = pair;
		if (input[indexAt] !== open) {
			return 0;
		}
		let cursor: number = indexAt + 1;
		let stack: number = 1;
		while (cursor < input.length) {
			const lengthDoubleQuote: number = getDoubleQuotedLength(cursor);
			if (lengthDoubleQuote > 0) {
				cursor += lengthDoubleQuote;
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
					return cursor - indexAt;
				}
				continue;
			}
			cursor += 1;
		}
		return 0;
	}
	function getBracketedLengthAny(indexAt: number = index): number {
		return Math.max(...brackets.map((pair: BracketPair): number => {
			return getBracketedLengthSpecify(pair, indexAt);
		}));
	}
	function getDoubleQuotedLength(indexAt: number = index): number {
		if (input[indexAt] !== "\"") {
			return 0;
		}
		let cursor: number = indexAt + 1;
		while (cursor < input.length) {
			if (input[cursor] === "\"" && input[cursor - 1] !== "\\") {
				return cursor + 1 - indexAt;
			}
			cursor += 1;
		}
		return 0;
	}
	function getText(): string {
		let cursor: number = index;
		while (cursor < input.length) {
			if (isCharacterSeparator(input[cursor])) {
				break;
			}
			const lengthBracket: number = getBracketedLengthAny(cursor);
			if (lengthBracket > 0) {
				cursor += lengthBracket;
				continue;
			}
			const lengthQuote: number = getDoubleQuotedLength(cursor);
			if (lengthQuote > 0) {
				cursor += lengthQuote;
				continue;
			}
			cursor += 1;
		}
		const value: string = input.slice(index, cursor).trimEnd();
		index += value.length;
		return value;
	}
	function isSeparator(indexAt: number = index): boolean {
		return isCharacterSeparator(input[indexAt]);
	}
	function skipWhitespace(): void {
		const item: string = input.slice(index);
		index += item.length - item.trimStart().length;
	}
	function throwOnEndAfterSeparator(separator: string): void {
		if (!(index < input.length)) {
			throw new SyntaxError(`Unexpected end after HTTP header value separator \`${separator}\` at index ${index}!`);
		}
	}
	function throwOnNonSeparator(): void {
		if (!isSeparator()) {
			throw new SyntaxError(`Unexpected character \`${input[index]}\` at index ${index}!`);
		}
	}
	skipWhitespace();
	if (isSeparator()) {
		throw new SyntaxError(`Unexpected HTTP header value separator \`${input[index]}\` at index ${index}!`);
	}
	while (index < input.length) {
		const group: (string | HTTPHeaderValueParameterPair)[] = [];
		while (index < input.length) {
			const key: string = getText();
			if (key.length === 0) {
				throw new SyntaxError(`Unexpected empty text at index ${index}!`);
			}
			const keyFmt: string = deDoubleQuoteNonStrict(key) ?? key;
			skipWhitespace();
			if (!(index < input.length)) {
				group.push(keyFmt);
				break;
			}
			throwOnNonSeparator();
			if (input[index] === ",") {
				group.push(keyFmt);
				break;
			}
			if (input[index] === ";") {
				group.push(keyFmt);
				index += 1;
				skipWhitespace();
				throwOnEndAfterSeparator(";");
				continue;
			}
			index += 1;
			skipWhitespace();
			throwOnEndAfterSeparator("=");
			const value: string = getText();
			if (value.length === 0) {
				throw new SyntaxError(`Unexpected empty text at index ${index}!`);
			}
			group.push({
				key,
				value: deDoubleQuoteNonStrict(value) ?? value
			});
			skipWhitespace();
			if (!(index < input.length)) {
				break;
			}
			throwOnNonSeparator();
			if (input[index] === "=") {
				throw new SyntaxError(`Unexpected HTTP header value separator \`${input[index]}\` at index ${index}!`);
			}
			if (input[index] === ",") {
				break;
			}
			index += 1;
			skipWhitespace();
			throwOnEndAfterSeparator(";");
		}
		if (group.length > 0) {
			yield group;
		}
		if (input[index] === ",") {
			index += 1;
			skipWhitespace();
			throwOnEndAfterSeparator(",");
		}
	}
}
/**
 * Split the HTTP header value.
 * @param {string} input HTTP header value that need to split.
 * @returns {(string | HTTPHeaderValueParameterPair)[][]}
 * @example
 * ```ts
 * splitHTTPHeaderValue(`br;q=1.0, gzip;q=0.8, *;q=0.1`);
 * //=>
 * //  [
 * //    ["br", { key: "q", value: "1.0" }],
 * //    ["gzip", { key: "q", value: "0.8" }],
 * //    ["*", { key: "q", value: "0.1" }]
 * //  ]
 * ```
 */
export function splitHTTPHeaderValue(input: string): (string | HTTPHeaderValueParameterPair)[][] {
	return Array.from(splitHTTPHeaderValueIterate(input));
}
