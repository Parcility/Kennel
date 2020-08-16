# Kennel
A complete implementation of Sileo's native depictions in TypeScript.

---

### Get Started

```shell script
$ npm i @zenithdevs/kennel
```

You will also need to put the following lines of HTML code into the `<head>` of any page you render depictions on:

```html
<!--Update the href link to the path to Kennel's CSS file. -->
<link rel="stylesheet" type="text/css" href="kennel.css">
<script>
    function ndChangeTab(show, hide) {
        let i;
        // Hide elements.
        for (i = 0; i < document.querySelectorAll(`${hide}.nd_tab`).length; i++) {
            document.querySelectorAll(`${hide}.nd_tab`)[i].classList.add("nd_hidden");
            document.querySelectorAll(`${hide}.nd_nav_btn`)[i].classList.remove("nd_active");
        }
        // Show elements.
        for (i = 0; i < document.querySelectorAll(`${show}.nd_tab`).length; i++) {
            document.querySelectorAll(`${show}.nd_tab`)[i].classList.remove("nd_hidden");
            document.querySelectorAll(`${show}.nd_nav_btn`)[i].classList.add("nd_active");
        }
    }
</script>
```

### API
Kennel was written to be as easy to interact with as possible.

> `Kennel(depiction: object, options: object)`
>
> The class that stores and renders a native depiction.
>
> `depiction`: An object that stores the native depiction's contents.
>
> `options`: An object that stores various options to pass to Kennel.

These are the options that can be set:
> `proxyURL`: A URL to prepend to all images, ideal for an image proxy server. Empty by default.
>
> `useShadowDom` A boolean that enables the insecure shadow DOM implementation for DepictionMarkdownView. False by default (recommended).
>
> `iframeHeader`: An HTML string to inject into DepictionMarkdownView IFrames. Will set text to white if dark mode (via \<style />) by default.
>
> `silenceErrors`: A boolean to silence any syntax errors from the depiction. False by default.
>
> `packagePrefix`: A URL to prepend to all package references. Uses the Parcility API by default.
>
> `defaultTint`: A CSS-compatible string to use as the default tint color.

All arguments are optional, but `depiction` is highly suggested for proper usage.

#### Example

```ts
// Import Kennel
const Kennel = require("@zenithdevs/kennel");

// Set options.
const options = {
    "iframeStyle": "",
    "useShadowDom": false
};

// Assumes the `depiction` variables exists elsewhere. Either could be omitted.
const nd = new Kennel(depiction, options);

// Renders the HTML code for the depiction.
const nd_out = nd.render();
```

A full demo is available in the `demo` folder.

---

### Building
This is not required if you installed Kennel through NPM.

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