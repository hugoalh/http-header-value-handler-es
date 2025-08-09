# HTTP Header Value Handler (ES)

[**⚖️** MIT](./LICENSE.md)

[![GitHub: hugoalh/http-header-value-handler-es](https://img.shields.io/github/v/release/hugoalh/http-header-value-handler-es?label=hugoalh/http-header-value-handler-es&labelColor=181717&logo=github&logoColor=ffffff&sort=semver&style=flat "GitHub: hugoalh/http-header-value-handler-es")](https://github.com/hugoalh/http-header-value-handler-es)
[![JSR: @hugoalh/http-header-value-handler](https://img.shields.io/jsr/v/@hugoalh/http-header-value-handler?label=@hugoalh/http-header-value-handler&labelColor=F7DF1E&logo=jsr&logoColor=000000&style=flat "JSR: @hugoalh/http-header-value-handler")](https://jsr.io/@hugoalh/http-header-value-handler)
[![NPM: @hugoalh/http-header-value-handler](https://img.shields.io/npm/v/@hugoalh/http-header-value-handler?label=@hugoalh/http-header-value-handler&labelColor=CB3837&logo=npm&logoColor=ffffff&style=flat "NPM: @hugoalh/http-header-value-handler")](https://www.npmjs.com/package/@hugoalh/http-header-value-handler)

An ECMAScript (JavaScript & TypeScript) module to handle the HTTP header value.

This serves most of the HTTP header value with general functions of syntax check, parse, and stringify; but not value check and validation.

## 🔰 Begin

### 🎯 Targets

| **Targets** | **Remote** | **JSR** | **NPM** |
|:--|:-:|:-:|:-:|
| **[Bun](https://bun.sh/)** >= v1.1.0 | ❌ | ✔️ | ✔️ |
| **[Deno](https://deno.land/)** >= v2.1.0 | ✔️ | ✔️ | ✔️ |
| **[NodeJS](https://nodejs.org/)** >= v20.9.0 | ❌ | ✔️ | ✔️ |

> [!NOTE]
> - It is possible to use this module in other methods/ways which not listed in here, however those methods/ways are not officially supported, and should beware maybe cause security issues.

### #️⃣ Resources Identifier

- **Remote - GitHub Raw:**
  ```
  https://raw.githubusercontent.com/hugoalh/http-header-value-handler-es/{Tag}/mod.ts
  ```
- **JSR:**
  ```
  [jsr:]@hugoalh/http-header-value-handler[@{Tag}]
  ```
- **NPM:**
  ```
  [npm:]@hugoalh/http-header-value-handler[@{Tag}]
  ```

> [!NOTE]
> - For usage of remote resources, it is recommended to import the entire module with the main path `mod.ts`, however it is also able to import part of the module with sub path if available, but do not import if:
>
>   - it's path has an underscore prefix (e.g.: `_foo.ts`, `_util/bar.ts`), or
>   - it is a benchmark or test file (e.g.: `foo.bench.ts`, `foo.test.ts`), or
>   - it's symbol has an underscore prefix (e.g.: `_bar`, `_foo`).
>
>   These elements are not considered part of the public API, thus no stability is guaranteed for them.
> - For usage of JSR or NPM resources, it is recommended to import the entire module with the main entrypoint, however it is also able to import part of the module with sub entrypoint if available, please visit the [file `jsr.jsonc`](./jsr.jsonc) property `exports` for available sub entrypoints.
> - It is recommended to use this module with tag for immutability.

### 🛡️ Runtime Permissions

*This module does not request any runtime permission.*

## 🧩 APIs

- ```ts
  function parseHTTPHeaderValue(input: string, options: HTTPHeaderValueParseOptions = {}): HTTPHeaderValueElementContext[];
  ```
- ```ts
  function splitHTTPHeaderValueWithoutParameter(input: string): string[];
  ```
- ```ts
  function splitHTTPHeaderValueWithParameter(input: string): (string | HTTPHeaderValueTokenParameter)[][];
  ```
- ```ts
  function stringifyHTTPHeaderValueFromContexts(input: readonly HTTPHeaderValueElementContext[]): string;
  ```
- ```ts
  function stringifyHTTPHeaderValueFromTokens(input: readonly (readonly (string | HTTPHeaderValueTokenParameter)[])[]): string;
  ```
- ```ts
  interface HTTPHeaderValueElementContext {
    value?: string;
    parameters: Record<string, string>;
  }
  ```
- ```ts
  interface HTTPHeaderValueParseOptions {
    parameterKeysCaseSensitive?: boolean;
    parameterKeysOnDuplicatedAction?: HTTPHeaderValueParseParameterKeysOnDuplicatedAction;
  }
  ```
- ```ts
  type HTTPHeaderValueParseParameterKeysOnDuplicatedAction =
    | "throw"
    | "use-new"
    | "use-old";
  ```
- ```ts
  type HTTPHeaderValueTokenParameter = [key: string, value: string];
  ```

> [!NOTE]
> - For the full or prettier documentation, can visit via:
>   - [Deno CLI `deno doc`](https://docs.deno.com/runtime/reference/cli/documentation_generator/)
>   - [JSR](https://jsr.io/@hugoalh/http-header-value-handler)

## ✍️ Examples

- ```ts
  splitHTTPHeaderValueWithParameter(`text/html, application/xhtml+xml, application/xml;q=0.9, image/webp`);
  /*=>
  [
    ["text/html"],
    ["application/xhtml+xml"],
    ["application/xml", ["q", "0.9"]],
    ["image/webp"]
  ]
  */
  ```
