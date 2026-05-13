# HTTP Header Value Handler (ES)

[**⚖️** MIT](./LICENSE.md)

🔗
[GitHub](https://github.com/hugoalh/http-header-value-handler-es)
● [JSR](https://jsr.io/@hugoalh/http-header-value-handler)
● [NPM](https://www.npmjs.com/package/@hugoalh/http-header-value-handler)

An ECMAScript module to handle the HTTP header value.

This serves most of the HTTP header value with general functions of syntax check, parse, and stringify; but not value check and validation.

## 🎯 Targets

| **Runtime \\ Source** | **GitHub Raw** | **JSR** | **NPM** |
|:--|:-:|:-:|:-:|
| **[Bun](https://bun.sh/)** >= v1.1.0 | ❌ | ✔️ | ✔️ |
| **[Deno](https://deno.land/)** >= v2.1.0 | ✔️ | ✔️ | ✔️ |
| **[NodeJS](https://nodejs.org/)** >= v20.9.0 | ❌ | ✔️ | ✔️ |

## 🛡️ Runtime Permissions

This does not request any runtime permission.

## #️⃣ Sources

- GitHub Raw
  ```
  https://raw.githubusercontent.com/hugoalh/http-header-value-handler-es/{Tag}/mod.ts
  ```
- JSR
  ```
  jsr:@hugoalh/http-header-value-handler[@{Tag}]
  ```
- NPM
  ```
  npm:@hugoalh/http-header-value-handler[@{Tag}]
  ```

> [!NOTE]
> - It is recommended to include tag for immutability.
> - These are not part of the public APIs hence should not be used:
>   - Benchmark/Test file (e.g.: `example.bench.ts`, `example.test.ts`).
>   - Entrypoint name or path include any underscore prefix (e.g.: `_example.ts`, `foo/_example.ts`).
>   - Identifier/Namespace/Symbol include any underscore prefix (e.g.: `_example`, `Foo._example`).

## ⤵️ Entrypoints

| **Name** | **Path** | **Description** |
|:--|:--|:--|
| `.` | `./mod.ts` | Default. |

## 🧩 APIs

- ```ts
  function parseHTTPHeaderValue(input: string, options: HTTPHeaderValueParseOptions = {}): HTTPHeaderValueElementContext[];
  ```
- ```ts
  function splitHTTPHeaderValue(input: string): (string | HTTPHeaderValueTokenParameter)[][];
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
  }
  ```
- ```ts
  type HTTPHeaderValueTokenParameter = [key: string, value: string];
  ```

> [!NOTE]
> - For the full or prettier documentation, can visit via:
>   - [Deno CLI `deno doc`](https://docs.deno.com/runtime/reference/cli/doc/)
>   - [JSR](https://jsr.io/@hugoalh/http-header-value-handler)

## ✍️ Examples

- ```ts
  splitHTTPHeaderValueWithParameter(`text/html, application/xhtml+xml, application/xml;q=0.9, image/webp`);
  //=>
  //  [
  //    ["text/html"],
  //    ["application/xhtml+xml"],
  //    ["application/xml", ["q", "0.9"]],
  //    ["image/webp"]
  //  ]
  ```
