import { isStringASCIIPrintable } from "https://raw.githubusercontent.com/hugoalh/is-string-ascii-es/v1.1.6/printable.ts";
export interface HTTPHeaderValueParameterValueDecodedContext {
	/**
	 * Language tag, according to the specification RFC 5646; However this value is never verified here and can be an arbitrary string.
	 */
	language: string | null;
	value: string;
}
const regexpParameterValueEncoded = /^UTF-?8'(?<language>.*?)'(?<encoded>.+)$/iu;
/**
 * Decode the HTTP header value parameter value, according to the specification RFC 8187, in non strict way.
 * @param {string} input The HTTP header value parameter value that need to decode.
 * @returns {HTTPHeaderValueParameterValueDecodedContext | null} Context of the decoded HTTP header value parameter value, or `null` if unable to decode.
 */
export function decodeHTTPHeaderValueParameterValueNonStrict(input: string): HTTPHeaderValueParameterValueDecodedContext | null {
	const {
		encoded = "",
		language = ""
	} = input.match(regexpParameterValueEncoded)?.groups ?? {};
	if (
		!isStringASCIIPrintable(input) ||
		encoded.length === 0
	) {
		return null;
	}
	const languageFmt: string = language.trim();
	return {
		language: (languageFmt.length === 0) ? null : languageFmt,
		value: decodeURIComponent(encoded)
	};
}
/**
 * Decode the HTTP header value parameter value, according to the specification RFC 8187.
 * @param {string} input The HTTP header value parameter value that need to decode.
 * @returns {HTTPHeaderValueParameterValueDecodedContext} Context of the decoded HTTP header value parameter value.
 * @example
 * ```ts
 * decodeHTTPHeaderValueParameterValue("UTF-8'en'%E2%82%AC%20rates");
 * //=>
 * //  {
 * //    language: "en",
 * //    value: "€ rates"
 * //  }
 * ```
 */
export function decodeHTTPHeaderValueParameterValue(input: string): HTTPHeaderValueParameterValueDecodedContext {
	const result: HTTPHeaderValueParameterValueDecodedContext | null = decodeHTTPHeaderValueParameterValueNonStrict(input);
	if (result === null) {
		throw new SyntaxError(`\`${input}\` is not a valid encoded HTTP header value parameter value!`);
	}
	return result;
}
/**
 * Encode the HTTP header value parameter value, according to the specification RFC 8187, in non strict way.
 * @param {string} input The HTTP header value parameter value that need to encode.
 * @param {string} [languageCode=""] Language code of the HTTP header value parameter value.
 * @returns {string | null} The encoded HTTP header value parameter value, or `null` if unable to encode.
 */
export function encodeHTTPHeaderValueParameterValueNonStrict(input: string, languageCode: string = ""): string | null {
	if (isStringASCIIPrintable(input)) {
		return null;
	}
	if (!isStringASCIIPrintable(languageCode)) {
		throw new SyntaxError(`\`${languageCode}\` is not a valid HTTP header parameter value language code!`);
	}
	return `UTF-8'${languageCode}'${encodeURIComponent(input)}`;
}
/**
 * Encode the HTTP header value parameter value, according to the specification RFC 8187.
 * @param {string} input The HTTP header value parameter value that need to encode.
 * @param {string} [languageCode=""] Language code of the HTTP header value parameter value.
 * @returns {string} The encoded HTTP header value parameter value.
 * @example
 * ```ts
 * encodeHTTPHeaderValueParameterValue("€ rates");
 * //=> "UTF-8''%E2%82%AC%20rates"
 * ```
 * @example
 * ```ts
 * encodeHTTPHeaderValueParameterValue("€ rates", "en");
 * //=> "UTF-8'en'%E2%82%AC%20rates"
 * ```
 */
export function encodeHTTPHeaderValueParameterValue(input: string, languageCode: string = ""): string {
	const result: string | null = encodeHTTPHeaderValueParameterValueNonStrict(input, languageCode);
	if (result === null) {
		throw new Error(`\`${input}\` is no need to be encoded HTTP header value parameter value!`);
	}
	return result;
}
