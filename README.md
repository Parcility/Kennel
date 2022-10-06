# Kennel

A complete implementation of Sileo's native depictions in TypeScript.

---

### Get Started

```shell script
$ npm i @parcility/kennel
```

### API

Kennel was written to be as easy to interact with as possible.

`render(depiction: any, options?: Partial<RenderOptions>): Promise<HTMLElement | string>`

> Render a depiction to either a HTMLElement or a string.
>
> `depiction`: An object that stores the native depiction's contents.
>
> `options`: The settings used for rendering.

> `options.ssr`: Output a string instead of a DOM element.
>
> `options.defaultTintColor`: The css color used for the tint.
>
> `options.backgroundColor`: The css color used for the background.
>
> `options.ignoredViewNames`: An array of view class names to ignore/not render.
>
> `options.linkForm`: Link to a webpage to render `form-` links.
>
>
> `options.linkHeaderless`: Link to a webpage to render `depiction-` links.
>
> `options.proxyIframeUrl`: The specific proxy url to use for iframe only.
>
> `options.proxyImageUrl`: The specific proxy url to use for image only.
>
> `options.proxyVideoUrl`: The specific proxy url to use for video only.
>
> `options.proxyUrl`: The default proxy url to use for iframe, image or video.

`hydrate(target?: ParentNode): void`

> Runs the hydrate function on views that need to be hydrate. Can only be ran on the client side.
> `target`: The root element for hydration. Defaults to `document.body`.

#### Example

```ts
// Import Kennel
import { render, hydrate } from "@parcility/kennel";

// Assumes the `depiction` variables exists elsewhere. The second argument (options) can be omitted.
let output = await render(depiction, { ssr: true });

// sometime on the client.
hydrate();
```

A full demo is available by running `yarn dev`.

---

### Development

### Testing

Run the test page, which loads depictions from the `test/` directory.

```shell script
yarn dev
```

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
