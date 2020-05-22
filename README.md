# Kennel
A complete implementation of Sileo's native depictions in TypeScript.

---

### Quickstart
```shell script
$ npm i @zenithdevs/kennel
```

### API
Kennel was written to be as easy to interact with as possible.

> `Kennel(depiction: object, proxyURL: string)`
>
> The class that stores and renders a native depiction.
>
> `depiction`: An object that stores the native depiction's contents.
>
> `proxyURL`: A URL to prepend to all image URLs, such as if you wanted to load them through your own proxy.
> 

All arguments are optional, but `depiction` is highly suggested for proper usage.

#### Example

```ts
// Import Kennel
import Kennel from '@zenithdevs/kennel';
// Assumes these variables exist elsewhere. Either could be omitted.
const nd = new Kennel(depiction, proxyURL);
// Renders the HTML code for the depiction.
const nd_out = nd.render();
```

A full demo is available in the `demo` folder.

### Building
1: Install dependencies
```shell script
npm i
```

2: Build module
```shell script
rollup -c
```

3 (optional): Build the demo.
```shell script
cd demo
node index.js
```