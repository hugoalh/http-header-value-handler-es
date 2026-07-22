import { deDoubleQuoteNonStrict } from "./quote.ts";
interface BracketPair {
	open: string;
	close: string;
}
const brackets: readonly BracketPair[] = [
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
class HTTPHeaderValueSplitter {
	#index: number = 0;
	#input: string;
	constructor(input: string) {
		this.#input = input;
	}
	#getBracketedLengthSpecify(pair: BracketPair, index: number = this.#index): number {
		const {
			open,
			close
		}: BracketPair = pair;
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
			if (isCharacterSeparator(this.#input[cursor])) {
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
		return isCharacterSeparator(this.#input[index]);
	}
	#skipWhitespace(): void {
		const item: string = this.#input.slice(this.#index);
		this.#index += item.length - item.trimStart().length;
	}
	*split(): Generator<(string | HTTPHeaderValueParameterPair)[]> {
		this.#skipWhitespace();
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
				const keyFmt: string = deDoubleQuoteNonStrict(key) ?? key;
				this.#skipWhitespace();
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
					this.#skipWhitespace();
					if (!(this.#index < this.#input.length)) {
						throw new SyntaxError(`Unexpected end after HTTP header value separator \`;\` at index ${this.#index}!`);
					}
					continue;
				}
				this.#index += 1;
				this.#skipWhitespace();
				if (!(this.#index < this.#input.length)) {
					throw new SyntaxError(`Unexpected end after HTTP header value separator \`=\` at index ${this.#index}!`);
				}
				const value: string = this.#getText();
				if (value.length === 0) {
					throw new SyntaxError(`Unexpected empty text at index ${this.#index}!`);
				}
				group.push({
					key,
					value: deDoubleQuoteNonStrict(value) ?? value
				});
				this.#skipWhitespace();
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
				this.#skipWhitespace();
				if (!(this.#index < this.#input.length)) {
					throw new SyntaxError(`Unexpected end after HTTP header value separator \`;\` at index ${this.#index}!`);
				}
			}
			if (group.length > 0) {
				yield group;
			}
			if (this.#input[this.#index] === ",") {
				this.#index += 1;
				this.#skipWhitespace();
				if (!(this.#index < this.#input.length)) {
					throw new SyntaxError(`Unexpected end after HTTP header value separator \`,\` at index ${this.#index}!`);
				}
			}
		}
	}
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
export function splitHTTPHeaderValueIterate(input: string): Generator<(string | HTTPHeaderValueParameterPair)[]> {
	return new HTTPHeaderValueSplitter(input).split();
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
