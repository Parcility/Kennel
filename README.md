# Kennel

A complete implementation of Sileo's native depictions in TypeScript.

---

### Get Started

```shell script
$ npm i @zenithdevs/kennel
```

### API

Kennel was written to be as easy to interact with as possible.

> `Kennel(depiction: any, ssr: boolean)`
>
> The class that stores and renders a native depiction.
>
> `depiction`: An object that stores the native depiction's contents.
>
> `ssr`: An optional boolean that determines whether the rendering step will generate DOM objects or strings.

#### Example

```ts
// Import Kennel
import Kennel from "@zenithdevs/kennel";

// Assumes the `depiction` variables exists elsewhere. The second argument (options) can be omitted.
const nd = new Kennel(depiction, {
	ssr: true,
});

// Renders the HTML code for the depiction.
const nd_out = await nd.render();
```

A full demo is available by running `yarn dev`.

---

### Building

This is not required if you installed Kennel through NPM.

1: Install dependencies

```shell script
yarn install
```

2: Build module

```shell script
yarn build
```

3 (optional): Test the demo.

```shell script
yarn dev
```
