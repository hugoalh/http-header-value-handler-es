# HTTP Header Value Handler (ES)

[**⚖️** MIT](./LICENSE.md)

🔗
[DistBoard @hugoalh](https://hugoalh.github.io/distboard/http_header_value_handler_ecmascript)
● [GitHub](https://github.com/hugoalh/http-header-value-handler-es)
● [JSR](https://jsr.io/@hugoalh/http-header-value-handler)
● [NPM](https://www.npmjs.com/package/@hugoalh/http-header-value-handler)

An ECMAScript module to handle the HTTP header value.

This serves most of the HTTP header value with general functions of syntax check, parse, and stringify; but not value check and validation.

## 🎯 Runtime Targets

Any runtime which support ECMAScript should able to use this; These runtimes are officially supported:

- **[Bun](https://bun.sh/)** >= v1.1.0
- **[Deno](https://deno.land/)** >= v2.1.0
- **[NodeJS](https://nodejs.org/)** >= v20.9.0

## 🛡️ Runtime Permissions

This does not request any runtime permission.

## #️⃣ Sources & Entrypoints

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

| **Name** | **Path** | **Description** |
|:--|:--|:--|
| `.` | `./mod.ts` | Default. |

> [!NOTE]
> - Different runtimes have vary support for the sources and entrypoints, visit the runtime documentation for more information.
> - It is recommended to include tag for immutability.
> - These are not part of the public APIs hence should not be used:
>   - Benchmark/Test file (e.g.: `example.bench.ts`, `example.test.ts`).
>   - Entrypoint name or path include any underscore prefix (e.g.: `_example.ts`, `foo/_example.ts`).
>   - Identifier/Namespace/Symbol include any underscore prefix (e.g.: `_example`, `Foo._example`).

## 🧩 APIs

- ```ts
  function parse(input: string, options?: HTTPHeaderValueOptions): HTTPHeaderValueElementContext[];
  ```
- ```ts
  function parseIterate(input: string, options?: HTTPHeaderValueOptions): Generator<HTTPHeaderValueElementContext>;
  ```
- ```ts
  function split(input: string): (string | HTTPHeaderValueParameterPair)[][];
  ```
- ```ts
  function splitIterate(input: string): Generator<(string | HTTPHeaderValueParameterPair)[]>;
  ```
- ```ts
  function stringifyFromContexts(input: readonly HTTPHeaderValueElementContext[]): string;
  ```
- ```ts
  function stringifyFromTokens(input: readonly (readonly (string | HTTPHeaderValueParameterPair)[])[]): string;
  ```
- ```ts
  interface HTTPHeaderValueElementContext {
    value?: string;
    parameters: Record<string, string>;
  }
  ```
- ```ts
  interface HTTPHeaderValueOptions {
    parametersKeyCaseSensitive?: boolean;
  }
  ```
- ```ts
  type HTTPHeaderValueParameterPair = [key: string, value: string];
  ```

> [!NOTE]
> - For the full or prettier documentation, can visit via:
>   - [Deno CLI `deno doc`](https://docs.deno.com/runtime/reference/cli/doc/)
>   - [JSR](https://jsr.io/@hugoalh/http-header-value-handler)

## ✍️ Examples

- ```ts
  split(`text/html, application/xhtml+xml, application/xml;q=0.9, image/webp`);
  //=>
  //  [
  //    ["text/html"],
  //    ["application/xhtml+xml"],
  //    ["application/xml", ["q", "0.9"]],
  //    ["image/webp"]
  //  ]
  ```
