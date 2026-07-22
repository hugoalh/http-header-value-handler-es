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
 * De-double-quote the text, in non strict way.
 * @param {string} input Text that need to de-double-quote.
 * @returns {string | null} The de-double-quoted text, or `null` if unable to de-double-quote.
 */
export function deDoubleQuoteNonStrict(input: string): string | null {
	if (input.length === getDoubleQuotedLength(input)) {
		return JSON.parse(input) as string;
	}
	return null;
}
/**
 * De-double-quote the text.
 * @param {string} input Text that need to de-double-quote.
 * @returns {string} The de-double-quoted text.
 * @example
 * ```ts
 * deDoubleQuote(`"foobar"`);
 * //=> `foobar`
 * ```
 */
export function deDoubleQuote(input: string): string {
	const result: string | null = deDoubleQuoteNonStrict(input);
	if (result === null) {
		throw new Error(`\`${input}\` is no need to de-double-quote!`);
	}
	return result;
}
/**
 * En-double-quote the text, in non strict way.
 * @param {string} input Text that need to en-double-quote.
 * @returns {string | null} The en-double-quoted text, or `null` if unable to en-double-quote.
 */
export function enDoubleQuoteNonStrict(input: string): string | null {
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
	return null;
}
/**
 * En-double-quote the text.
 * @param {string} input Text that need to en-double-quote.
 * @returns {string} The en-double-quoted text.
 */
export function enDoubleQuote(input: string): string {
	const result: string | null = enDoubleQuoteNonStrict(input);
	if (result === null) {
		throw new Error(`\`${input}\` is no need to en-double-quote!`);
	}
	return result;
}
