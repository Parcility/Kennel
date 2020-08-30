/*
    Kennel is made available under the MIT License.

    Copyright (c) 2020 Zenith <zenithdevs.com>, Shuga <shuga.co>.

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.

    Research was conducted on Sileo (https://github.com/Sileo/Sileo) for some
    rendering logic and styles to accurately mimic their native depictions.

    Kennel depends on Marked (https://marked.js.org/#/README.md#README.md).
*/

const marked = require("marked");

// GFM is used unless useRawFormat is set to true.
// TODO: Properly mod Marked to disable link parsing, enable code blocks with escape code.
marked.setOptions({
    xhtml: true,
    gfm: true
});

/**
 * Kennel
 * The class that stores and renders a native depiction.
 *
 * @param {object} Depiction Stores the native depiction.
 * @param {object} options Stores various options to pass to Kennel. Optional.
 *
 * Options:
 *  - {string} proxyURL A URL to prepend to all images, ideal for an image proxy server. Empty by default.
 *  - {boolean} useShadowDom Enables the insecure shadow DOM implementation for DepictionMarkdownView. False by default.
 *  - {string} iframeHeader HTML to inject into DepictionMarkdownView IFrames. Will set text to white if dark mode (via <style />) by default.
 *  - {boolean} silenceErrors Silence any syntax errors from the depiction. False by default.
 *  - {string} packagePrefix A URL to prepend to all package references. Uses the Parcility API by default.
 *  - {string} defaultTint A CSS-compatible string to use as the default tint color.
 */
export default class Kennel {
    // Declare data types.
    readonly #depiction: object;
    readonly #proxyURL: string;
    readonly #useShadowDom: boolean;
    readonly #silenceErrors: boolean;
    readonly #iframeHeader: string;
    readonly #options: boolean;
    readonly #tint: string;
    readonly #packagePrefix: string;
    readonly #defaultTint: string;
    #views: Map<String, Function>;

    constructor(depiction: object, options: object) {
        const dummyDepiction = {"minVersion": "0.1", "tintColor": "#6264D3", "class": "DepictionLabelView", "text": "(This depiction is empty.)"};
        this.#depiction = (typeof depiction != "undefined") ? depiction : dummyDepiction;
        if (typeof options != "undefined") {
            this.#proxyURL = (typeof options["proxyURL"] != "undefined") ? options["proxyURL"] : "";
            this.#iframeHeader = (typeof options["iframeHeader"] != "undefined") ? options["iframeHeader"] : "<style>@media (prefers-color-scheme: dark) { html {color: white} }</style>";
            this.#useShadowDom = Boolean(options["useShadowDom"]);
            this.#silenceErrors = Boolean(options["silenceErrors"]);
            this.#packagePrefix = (typeof options["packagePrefix"] != "undefined" ? options["packagePrefix"] : "https://api.parcility.co/render/package/");
            this.#defaultTint = (typeof options["defaultTint"] != "undefined") ? options["defaultTint"] : "#6264d3";
        } else {
            this.#proxyURL = "";
            this.#iframeHeader = "<style>@media (prefers-color-scheme: dark) { html {color: white} }</style>";
            this.#useShadowDom = false;
            this.#silenceErrors = false;
            this.#packagePrefix = "https://api.parcility.co/render/package/";
            this.#defaultTint = "#6264d3";
        }
        this.#tint = (typeof this.#depiction["tintColor"] != "undefined" && this.#depiction["tintColor"] !== "") ? Kennel._sanitizeColor(this.#depiction["tintColor"]) : this.#defaultTint;

        // Build a map of all the classes Kennel knows about.
        this.#views = new Map<String, Function>();
        this.#views.set("DepictionStackView", (elem: object) => this._DepictionStackView(elem));
        this.#views.set("DepictionAutoStackView", (elem: object) => this._DepictionAutoStackView(elem));
        this.#views.set("DepictionTabView", (elem: object) => this._DepictionTabView(elem));
        this.#views.set("DepictionTableTextView", (elem: object) => this._DepictionTableTextView(elem));
        this.#views.set("DepictionTableButtonView", (elem: object) => this._DepictionTableButtonView(elem));
        this.#views.set("DepictionLabelView", (elem: object) => this._DepictionLabelView(elem));
        this.#views.set("DepictionScreenshotsView", (elem: object) => this._DepictionScreenshotsView(elem));
        this.#views.set("DepictionSpacerView", (elem: object) => this._DepictionSpacerView(elem));
        this.#views.set("DepictionSeparatorView", (elem: object) => this._DepictionSeparatorView(elem));
        this.#views.set("DepictionHeaderView", (elem: object) => this._DepictionHeaderView(elem));
        this.#views.set("DepictionSubheaderView", (elem: object) => this._DepictionSubheaderView(elem));
        this.#views.set("DepictionButtonView", (elem: object) => this._DepictionButtonView(elem));
        this.#views.set("DepictionImageView", (elem: object) => this._DepictionImageView(elem));
        this.#views.set("DepictionRatingView", (elem: object) => this._DepictionRatingView(elem));
        this.#views.set("DepictionReviewView", (elem: object) => this._DepictionReviewView(elem));
        this.#views.set("DepictionWebView", (elem: object) => this._DepictionWebView(elem));
        this.#views.set("DepictionVideoView", (elem: object) => this._DepictionVideoView(elem));
        this.#views.set("DepictionBannersView", (elem: object) => this._DepictionBannersView(elem));
        this.#views.set("FeaturedBannersView", (elem: object) => this._DepictionBannersView(elem));
        this.#views.set("DepictionAdmobView", (elem: object) => this._DepictionAdmobView(elem));

        // Respect useShadowDom setting.
        if (this.#useShadowDom)
            this.#views.set("DepictionMarkdownView", (elem: object) => this._DepictionMarkdownShadowDomView(elem));
        else
            this.#views.set("DepictionMarkdownView", (elem: object) => this._DepictionMarkdownView(elem));

    }
    /**
     * render()
     * Renders the body of the depiction.
     * Does not include any styles. This has to be imported as a CSS file.
     *
     * @return string A string of minified HTML.
     */
    render() {
        // This is the string that will contain everything.
        let tint: string = Kennel._sanitizeColor(this.#tint);
        let buffer: string = `<div class="native_depiction"><style>a, .nd_tint, .nd_active {color: ${tint}} .nd_active {border-bottom: 2px solid ${tint};} .nd_btn {background-color: ${tint}}</style>`;
        buffer += this._DepictionBaseView(this.#depiction);

        buffer += "</div>";

        return buffer;
    }
    /**
     * _DepictionBaseView(elem)
     * Renders a DepictionBaseView, given Object elem for context.
     * Calling directly is not recommended but is possible.
     *
     * This method essentially determines what Sileo class the element should use.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionBaseView(elem: object) {
        let fn: any, kennelError: string;
        // This is where we see what class an element is and subsequently call a function to render it.
        if (elem["class"]) {
            try {
                if (elem["class"].toLowerCase().includes("hidden")) return "";
                fn = this.#views.get(elem["class"]);
                if (typeof fn != "function") return this._DepictionUnknownView(elem);
                return fn(elem);
            } catch(e) {
                if (e.name === "TypeError") {
                    console.error("Kennel: Element is malformed.")
                    return this._DepictionErrorView(elem, "Could not render malformed element");
                } else if (e.indexOf("kennel:") !== -1) {
                    kennelError = e.substring(7);
                    console.error(`Kennel: ${kennelError}`);
                    return this._DepictionErrorView(elem, kennelError);
                } else {
                    console.error("Kennel: An unknown error occurred.");
                    return this._DepictionErrorView(elem, "An unknown error occurred during render");
                }
            }
        } else {
            console.log("Kennel: Class for element is not defined.")
            elem["class"] = "UndefinedViewClass";
            return this._DepictionErrorView(elem, "Class for element is not defined");
        }
    }
    /**
     * _DepictionTabView(elem)
     * Renders a DepictionTabView, given Object elem for context.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionTabView(elem: object) {
        let i: number;
        let buffer: string = `<div class="nd_tabView">`;

        // Give this TabView a unique ID.
        let tabViewId: string = Kennel._makeIdentifier("nd_tabView");

        // Render tab selector.
        buffer += `<div class="nd_nav">`;
        for (i = 0; i < elem["tabs"].length; i++)
            buffer += `<div class="${tabViewId} ${tabViewId}_tab_${i} nd_nav_btn nd_tweak_info_btn ${(i == 0) ? "nd_active" : ""}" onclick="ndChangeTab('.${tabViewId}_tab_${i}', '.${tabViewId}')">${Kennel._sanitize(elem["tabs"][i].tabname)}</div>`;
        buffer += `</div>`;

        // Render the tabs themselves
        buffer += `<div>`;
        for (i = 0; i < elem["tabs"].length; i++) {
            // Be consistent on our use of random IDs!
            buffer += `<div class="nd_tab ${tabViewId} ${tabViewId}_tab_${i} ${i > 0 ? "nd_hidden" : ""}">`;
            buffer += this._DepictionBaseView(elem["tabs"][i]);
            buffer += `</div>`
        }

        buffer += `</div></div>`;

        // Return minified JS.
        return buffer;
    }
    /**
     * _DepictionStackView(elem)
     * Renders a DepictionStackView, given Object elem for context.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionStackView(elem: object) {
        let i: number;
        let buffer: string = "";

        if (typeof elem["backgroundColor"] != "undefined")
            buffer += `<div class="nd_nested_stack" style="background: ${Kennel._sanitizeColor(elem["backgroundColor"])}">`;
        else
            buffer += `<div class="nd_nested_stack">`;

        if (typeof elem["orientation"] == "undefined" || elem["orientation"].toLowerCase() !== "landscape") {
            // Standard orientation
            for (i = 0; i < elem["views"].length; i++)
                buffer += this._DepictionBaseView(elem["views"][i]);
        } else {
            // "Landscape" orientation, or causing StackViews to be next to each other.
            buffer += `<div class="nd_landscape_stack">`;
            for (i = 0; i < elem["views"].length; i++)
                buffer += this._DepictionBaseView(elem["views"][i]);
            buffer += `</div>`;
        }

        buffer += `</div>`;
        return buffer;
    }
    /**
     * _DepictionAutoStackView(elem)
     * Renders a DepictionAutoStackView, given Object elem for context.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionAutoStackView(elem: object) {
        let i: number;
        let buffer: string = "";
        if (typeof elem["backgroundColor"] != "undefined")
            buffer += `<div class="nd_nested_stack" style="background: ${Kennel._sanitizeColor(elem["backgroundColor"])}; width: ${elem["horizontalSpacing"] ? `${Kennel._sanitizeDouble(elem["horizontalSpacing"])}px` : "100%"}">`;
        else
            buffer += `<div class="nd_nested_stack" style="width: ${elem["horizontalSpacing"] ? `${Kennel._sanitizeDouble(elem["horizontalSpacing"])}px` : "100%"}">`;

        if (typeof elem["orientation"] == "undefined" || elem["orientation"].toLowerCase() !== "landscape") {
            // Standard orientation
            for (i = 0; i < elem["views"].length; i++)
                buffer += this._DepictionBaseView(elem["views"][i]);
        } else {
            // "Landscape" orientation, or causing StackViews to be next to each other.
            buffer += `<div class="nd_landscape_stack">`;
            for (i = 0; i < elem["views"].length; i++)
                buffer += this._DepictionBaseView(elem["views"][i]);
            buffer += `</div>`;
        }

        buffer += `</div>`;
        return buffer;
    }
    /**
     * _DepictionTableTextView(elem)
     * Renders a DepictionTableTextView, given Object elem for context.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionTableTextView(elem: object) {
        if (typeof elem["title"] == "undefined") throw "kennel:Missing required \"title\" property";
        if (typeof elem["text"] == "undefined") throw "kennel:Missing required \"text\" property";

        return `<div class="nd_table"><div class="nd_cell"><div class="nd_title">${Kennel._sanitize(elem["title"])}</div><div class="nd_text">${Kennel._sanitize(elem["text"])}</div></div></div>`;
    }
    /**
     * _DepictionTableButtonView(elem)
     * Renders a DepictionTableButtonView, given Object elem for context.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionTableButtonView(elem: object) {
        let extra_params: string = "";

        if (typeof elem["title"] == "undefined") throw "kennel:Missing required \"title\" property";
        if (typeof elem["action"] == "undefined") throw "kennel:Missing required \"action\" property";

        if (elem["openExternal"]) {
            extra_params += ` target="_blank"`;
        }
        if (elem["yPadding"] || elem["tintColor"]) {
            extra_params += ` style="`;
            if (elem["yPadding"])
                extra_params += `padding-bottom: '${Kennel._sanitizeDouble(elem["yPadding"])}';`;
            if (elem["tintColor"]) {
                extra_params += `color: ${Kennel._sanitizeColor(elem["tintColor"])};`;
            }
            extra_params += `"`;
        }
        elem["action"] = Kennel._sanitize(Kennel._buttonLinkHandler(elem["action"], elem["title"]));
        return `<a class="nd nd_table-btn" href="${elem["action"]}"${extra_params}><div>${Kennel._sanitize(elem["title"])}</div></a>`;
    }
    /**
     * _DepictionButtonView(elem)
     * Renders a DepictionButtonView, given Object elem for context.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionButtonView(elem: object) {
        let extra_params: string = "";

        if (typeof elem["text"] == "undefined") throw "kennel:Missing required \"text\" property";
        if (typeof elem["action"] == "undefined") throw "kennel:Missing required \"action\" property";

        if (elem["openExternal"]) {
            extra_params += ` target="_blank"`;
        }
        if (elem["yPadding"] || elem["tintColor"]) {
            extra_params += ` style="`;
            if (elem["yPadding"])
                extra_params += `padding-bottom: '${Kennel._sanitizeDouble(elem["yPadding"])}';`;
            if (elem["tintColor"]) {
                extra_params += `background-color: ${Kennel._sanitizeColor(elem["tintColor"])};`;
            }
            extra_params += `"`;
        }
        elem["action"] = Kennel._sanitize(Kennel._buttonLinkHandler(elem["action"], elem["text"]));
        return `<a class="nd nd_btn" href="${elem["action"]}"${extra_params}>${Kennel._sanitize(elem["text"])}</a>`;
    }
    /**
     * _DepictionMarkdownShadowDomView(elem)
     * Renders a DepictionMarkdownView, given Object elem for context, using a shadow DOM.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionMarkdownShadowDomView(elem: object) {
        let noJSRender: string, xssWarn: string, rendered: string;
        let didWarnXSS: boolean = false;
        let ident: string = Kennel._makeIdentifier("md");

        if (typeof elem["markdown"] == "undefined") throw "kennel:Missing required \"markdown\" property";

        // Is there a tint color passed?
        if (typeof elem["tintColor"] == "undefined" && typeof this.#tint == "undefined")
            elem["tintColor"] = "#6264D3";
        else if (typeof elem["tintColor"] == "undefined" && typeof this.#tint != "undefined")
            elem["tintColor"] = this.#tint;

        xssWarn = `<p style="opacity:0.3">[Warning: This depiction may be trying to maliciously run code in your browser.]</p><br>`

        if (elem["useRawFormat"]) {
            // ! BEWARE OF XSS ! //
            // Unfortunately, this is a design flaw with the spec.
            // TODO: Just disable link parsing. This is non-trivial to do, so for now, we just disable GFM-flavored Markdown for useRawFormat.
            marked.setOptions({gfm: false});
            rendered = marked(elem["markdown"]).replace(/<hr>/ig, this._DepictionSeparatorView(elem));
            marked.setOptions({gfm: true});

            // Remove all <script> tags.
            if (rendered.toLowerCase().indexOf("<script>") !== -1 || rendered.toLowerCase().indexOf("</script>") !== -1) {
                // If <script> is detected, sanitize it.
                rendered = rendered.replace(/<script>/im, "&lt;script&gt;").replace(/<\/script>/im, "&lt;/script&gt;")

                didWarnXSS = true;
                rendered = `${xssWarn}${rendered}`;
            }
            // Remove onerror/onload/etc
            if (/on([^\s]+?)=/im.test(rendered)) {
                if (!didWarnXSS) {
                    rendered = `${xssWarn}${rendered}`;
                    didWarnXSS = true;
                }
                rendered = rendered.replace(/on([^\s]+?)=/ig, "onXSSAttempt=");
            }

        } else {
            rendered = marked(Kennel._laxSanitize(elem["markdown"])).replace(/<hr>/g, this._DepictionSeparatorView(elem));
        }

        // Use <script> to help build the shadow DOM, as we're sending this to a page that is
        // yet to load.
        if (rendered.indexOf("<style>") !== -1) {
            // This render includes a style element! Let's make sure it's accounted for properly!
            // *because shadow DOMs can't have body tags, we gotta do some editing.
            let newStyleEl: string;
            let firstHalf: number = -1;
            let secondHalf: number = -1;

            while (rendered.indexOf("<style>", firstHalf + 1) !== -1) {
                firstHalf = rendered.indexOf("<style>", firstHalf);
                secondHalf = rendered.indexOf("</style>", secondHalf);

                newStyleEl = rendered.substring(firstHalf + 7, secondHalf);
                newStyleEl = newStyleEl.replace(/body/g, "root").replace(/html/g, "root");
                rendered = rendered.substring(0, firstHalf + 7) + newStyleEl + rendered.substring(secondHalf);

                firstHalf++;
                secondHalf++;
            }

            // JS-free rendering.
            noJSRender = rendered.substring(0, rendered.indexOf("<style>")) + rendered.substring(rendered.indexOf("</style>") + 8);
        } else {
            noJSRender = rendered;
        }

        // Return the JavaScript code needed to create the shadow DOM.
        // I know this is a very long line, but all functions shall output minified JS, and the
        // extra time it costs to remove the whitespaces programmatically isn't worth it.
        return `<div id="${ident}" class="nd_md_view"><noscript>${noJSRender}</noscript><script>mdEl = document.createElement("sandboxed-markdown");shadowRoot = mdEl.attachShadow({mode: 'open'});shadowRoot.innerHTML = \`<style>a {color:${Kennel._sanitizeColor(elem["tintColor"])};text-decoration: none} a:hover {opacity:0.8} h1, h2, h3, h4, h5, h6, p {margin-top: 5px; margin-bottom: 5px; font-size: 12px;}</style><root>${rendered}</root>\`;el = document.getElementById("${ident}");el.appendChild(mdEl);el.removeAttribute("id");el.removeChild(el.children[0]);el.removeChild(el.children[0]);</script></div>`;
    }

    /**
     * _DepictionMarkdownView(elem)
     * Renders a DepictionMarkdownView, given Object elem for context.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionMarkdownView(elem: object) {
        let rendered: string;
        let ident: string = Kennel._makeIdentifier("md");
        let spacing: number = 5;
        let margin: string;

        if (typeof elem["markdown"] == "undefined") throw "kennel:Missing required \"markdown\" property";

        // Is there a tint color passed?
        if (typeof elem["tintColor"] == "undefined" && typeof this.#tint == "undefined")
            elem["tintColor"] = "#6264D3";
        else if (typeof elem["tintColor"] == "undefined" && typeof this.#tint != "undefined")
            elem["tintColor"] = this.#tint;
            
        if (typeof elem["useSpacing"] != "undefined" && elem["useSpacing"] == false)
            spacing = 0;

        if (typeof elem["useMargins"] != "undefined" && elem["useMargins"] == false)
            margin = "margin: 0;"
        else
            margin = "margin: 5px;"

        if (elem["useRawFormat"]) {
            marked.setOptions({gfm: false});
            rendered = marked(elem["markdown"]).replace(/<hr\/>/ig, this._DepictionSeparatorView(elem));
            marked.setOptions({gfm: true});
        } else {
            rendered = marked(elem["markdown"]).replace(/<hr\/>/ig, this._DepictionSeparatorView(elem));
        }

        // ResizeObserver: Resize to fix sizing.
        let onload: string = `try {
            let e = this.contentDocument.body.lastChild;
            let r = new ResizeObserver(_ => {
                try {
                    this.height = getComputedStyle(this.contentDocument.documentElement).height;
                } catch(e) {}
            });
            r.observe(e);
            this.height = getComputedStyle(this.contentDocument.documentElement).height;
        } catch(err) {}`;

        // I know these are some very long lines, but all functions shall output minified JS, and the
        // extra time it costs to remove the whitespaces programmatically isn't worth it.
        rendered = `<html><head><base target='_top'>${this.#iframeHeader.replace(/"/g, "'")}<style>${typeof elem["title"] != "undefined" ? "@media (prefers-color-scheme: dark) { html { color: white; }}" : ""} a {color:${Kennel._sanitizeColor(elem["tintColor"])};text-decoration: none} a:hover {opacity:0.8} h1, h2, h3, h4, h5, h6, p {margin-top: 5px; margin-bottom: 5px;} body {margin-top: ${spacing}px; margin-bottom: ${spacing}px; ${margin}} *:not(code) {font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 'Helvetica', sans-serif} blockquote {color: grey;} pre {white-space: pre-wrap} * {max-width: 100%}</style></head><body>${rendered.replace(/"/ig, "&quot;")}<div style='height: 0px'></div></body></html>`
        return `<iframe onload="${Kennel._laxSanitize(onload)}" sandbox="allow-same-origin allow-popups allow-top-navigation" id="${ident}" class="nd_md_iframe" srcdoc="${rendered}"></iframe>`;
    }
    /**
     * _DepictionLabelView(elem)
     * Renders a DepictionLabelView, given Object elem for context.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionLabelView(elem: object) {
        let marginStr: string;

        if (typeof elem["text"] == "undefined") throw "kennel:Missing required \"text\" property";

        // useMargins takes precedence.
        if (elem["margins"] && (typeof elem["useMargins"] == "undefined" || elem["useMargins"] == true))
            marginStr = Kennel._marginResolver(elem["margins"]);
        else if(!elem["margins"] && (typeof elem["useMargins"] == "undefined" || elem["useMargins"] == true))
            marginStr = "margin: 2px;";
        else
            marginStr = "margin: 0;"

        // If usePadding is false, remove top/bottom margin.
        if (typeof elem["usePadding"] != "undefined" && elem["usePadding"] == false)
            marginStr += "margin-top: 0; margin-bottom: 0;"

        elem["alignment"] = Kennel._alignmentResolver(elem["alignment"]);
        elem["fontWeight"] = Kennel._weightStringResolver(elem["fontWeight"]);
        elem["textColor"] = (typeof elem["textColor"] != "undefined")
            ? `color: ${Kennel._sanitizeColor(elem["textColor"])};` : "";
        elem["fontSize"] = (typeof elem["fontSize"] != "undefined")
            ? `font-size: ${Kennel._sanitizeDouble(elem["fontSize"])}px;` : "";

        return `<div class="nd_label" style="font-weight: ${elem["fontWeight"]}; text-align:${elem["alignment"]}; ${elem["textColor"]}${elem["fontSize"]}${marginStr}">${Kennel._sanitize(elem["text"])}</div>`;
    }
    /**
     * _DepictionScreenshotsView(elem)
     * Renders a DepictionScreenshotsView, given Object elem for context.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionScreenshotsView(elem: object) {
        // Parse itemSize, screenshotObject
        let size: string[], x: number, y: number, ssURL: string;
        let ret: string = `<div class="nd_scroll_view">`;
        let sizeStr: string = "";
        let i: number;

        if (typeof elem["screenshots"] == "undefined") throw "kennel:Missing required \"screenshots\" property";
        if (typeof elem["itemCornerRadius"] == "undefined") throw "kennel:Missing required \"itemCornerRadius\" property";
        if (typeof elem["itemSize"] == "undefined") throw "kennel:Missing required \"itemSize\" property";

        size = elem["itemSize"].substring(1, elem["itemSize"].length-1).split(",");
        x = Number(size[0]);
        y = Number(size[1]);

        sizeStr = `${x > y ? "width" : "height"}: ${Kennel._sanitizeDouble(Math.max(x, y))}px`;

        for (i = 0; i < elem["screenshots"].length; i++) {
            if (typeof elem["screenshots"][i]["url"] == "undefined") throw "kennel:Missing required \"url\" property in screenshot object.";
            ssURL = Kennel._laxSanitize(`${this.#proxyURL}${elem["screenshots"][i]["url"]}`);
            if (elem["screenshots"][i]["video"])
                ret += `<video controls class="nd_img_card" style="${Kennel._sanitize(sizeStr)}; border-radius: ${Kennel._sanitizeDouble(elem["itemCornerRadius"])}px" alt="${Kennel._sanitize(elem["screenshots"][i].accessibilityText)}"><source src="${ssURL}"></video>`;
            else
               ret += `<img loading="lazy" style="${Kennel._sanitize(sizeStr)}; border-radius: ${Kennel._sanitizeDouble(elem["itemCornerRadius"])}px" class="nd_img_card" alt="${Kennel._sanitize(elem["screenshots"][i].accessibilityText)}" src="${ssURL}">`;
        }

        ret += `</div>`;
        return ret;
    }
    /**
     * _DepictionSpacerView(elem)
     * Renders a DepictionSpacerView, given Object elem for context.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionSpacerView(elem: object) {
        let spacing: string;

        if (typeof elem["spacing"] == "undefined") throw "kennel:Missing required \"spacing\" property";

        spacing = Kennel._sanitizeDouble(elem["spacing"]);
        return `<div class="nd_br" style="padding-top: ${spacing}px"></div>`;
    }
    /**
     * _DepictionSeparatorView(elem)
     * Renders a DepictionSeparatorView, given Object elem for context.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionSeparatorView(elem: object) {
        return `<div class="nd_hr"></div>`;
    }
    /**
     * _DepictionHeaderView(elem)
     * Renders a DepictionHeaderView, given Object elem for context.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionHeaderView(elem: object) {
        let margin: string = "";
        if (typeof elem["title"] == "undefined") throw "kennel:Missing required \"title\" property";

        elem["fontWeight"] = "bold";
        if (typeof elem["useBoldText"] != "undefined") {
            elem["fontWeight"] = elem["useBoldText"] ? "bold" : "normal";
        }

        // If useMargin is false, remove all margins.
        if (typeof elem["useMargins"] != "undefined" && elem["useMargins"] == false)
            margin += "margin: 0;"

        // If useBottomMargin is false, remove margin.
        if (typeof elem["useBottomMargin"] == "undefined" || elem["useBottomMargin"] == true)
            margin += "margin-bottom: 23px;";
        else
            margin += "margin-bottom: 0px;";

        return `<h3 class="nd_header" style="${margin}text-align: ${Kennel._alignmentResolver(elem["alignment"])};font-weight: ${Kennel._sanitize(elem["fontWeight"])}">${Kennel._sanitize(elem["title"])}</h3>`;
    }
    /**
     * _DepictionSubheaderView(elem)
     * Renders a DepictionSubheaderView, given Object elem for context.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionSubheaderView(elem: object) {
        let margin: string = "";
        if (typeof elem["title"] == "undefined") throw "kennel:Missing required \"title\" property";

        elem["fontWeight"] = "normal";
        if (typeof elem["useBoldText"] != "undefined") {
            elem["fontWeight"] = elem["useBoldText"] ? "bold" : "normal";
        }

        // If useMargin is false, remove all margins.
        if (typeof elem["useMargins"] != "undefined" && elem["useMargins"] == false)
            margin += "margin: 0;"

        // If useBottomMargin is false, remove margin.
        if (typeof elem["useBottomMargin"] == "undefined" || elem["useBottomMargin"] == true)
            margin += "margin-bottom: 23px;";
        else
            margin += "margin-bottom: 0px;";

        return `<h4 class="nd_header" style="${margin}text-align: ${Kennel._alignmentResolver(elem["alignment"])};font-weight: ${Kennel._sanitize(elem["fontWeight"])}">${Kennel._sanitize(elem["title"])}</h4>`;
    }
    /**
     * _DepictionImageView(elem)
     * Renders a DepictionImageView, given Object elem for context.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionImageView(elem: object) {
        let url: string;
        let padding: string;

        if (typeof elem["URL"] == "undefined") throw "kennel:Missing required \"URL\" property";
        if (typeof elem["width"] == "undefined") throw "kennel:Missing required \"width\" property";
        if (typeof elem["height"] == "undefined") throw "kennel:Missing required \"height\" property";
        if (typeof elem["cornerRadius"] == "undefined") throw "kennel:Missing required \"cornerRadius\" property";

        url = Kennel._laxSanitize(`${this.#proxyURL}${elem["URL"]}`); // Use proxy server (if set).
        padding = (typeof elem["xPadding"] != "undefined" ? `padding-top:${Kennel._sanitizeDouble(elem["xPadding"])}px;padding-bottom:${Kennel._sanitizeDouble(elem["xPadding"])}px;` :"");
        elem["alignment"] = Kennel._alignmentResolver(elem["alignment"]);
        return `<div style="text-align:${elem["alignment"]};"><img loading="lazy" src="${url}" style="width:${Kennel._sanitizeDouble(elem["width"])}px;height:${Kennel._sanitizeDouble(elem["height"])}px;border-radius:${Kennel._sanitizeDouble(elem["cornerRadius"])}px;max-width:100%;${padding}" alt="Image from depiction."></div>`;
    }
    /**
     * _DepictionRatingView(elem)
     * Renders a DepictionRatingView, given Object elem for context.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionRatingView(elem: object) {
        let stars: string;

        if (typeof elem["rating"] == "undefined") throw "kennel:Missing required \"rating\" property";
        if (typeof elem["alignment"] == "undefined") throw "kennel:Missing required \"alignment\" property";

        stars = Kennel._starString(elem["rating"]);
        elem["alignment"] = Kennel._alignmentResolver(elem["alignment"]);
        return `<div title="${Kennel._sanitizeDouble(elem["rating"])}/5 stars." style="color:#a1a1a1; text-align:${elem["alignment"]};">${stars}</div>`;
    }
    /**
     * _DepictionReviewView(elem)
     * Renders a DepictionReviewView, given Object elem for context.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionReviewView(elem: object) {
        let ratingStr: string;
        let md: string;

        if (typeof elem["title"] == "undefined") throw "kennel:Missing required \"title\" property";
        if (typeof elem["author"] == "undefined") throw "kennel:Missing required \"author\" property";
        if (typeof elem["markdown"] == "undefined") throw "kennel:Missing required \"markdown\" property";

        md = this._DepictionMarkdownView(elem);

        if (typeof elem["rating"] != "undefined") {
            elem["alignment"] = 2;
            ratingStr = this._DepictionRatingView(elem);
        } else {
        ratingStr = "";
       }
        return `<div class="nd_review"><div class="nd_review_head"><div class="nd_left"><p>${Kennel._sanitize(elem["title"])}</p><p class="nd_author">by ${Kennel._sanitize(elem["author"])}</p></div><div class="nd_right">${ratingStr}</div></div>${md}</div>`;
    }
    /**
     * _DepictionWebView(elem)
     * Renders a DepictionWebView, given Object elem for context.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionWebView(elem: object) {
        if (typeof elem["URL"] == "undefined") throw "kennel:Missing required \"URL\" property";
        if (typeof elem["width"] == "undefined") throw "kennel:Missing required \"width\" property";
        if (typeof elem["height"] == "undefined") throw "kennel:Missing required \"height\" property";

        elem["alignment"] = Kennel._alignmentResolver(elem["alignment"]);

        // Implementation details: Discussions with repos show a disdain for Sileo's whitelist approach.
        // As a result, all URLs are supported.
        return `<div style="text-align: ${elem["alignment"]}"><iframe class="nd_max_width" src="${Kennel._laxSanitize(elem["URL"])}" style="width: ${Kennel._sanitizeDouble(elem["width"])}px; height: ${Kennel._sanitizeDouble(elem["height"])}px;"></iframe></div>`;
    }
    /**
     * _DepictionVideoView(elem)
     * Renders a DepictionVideoView, given Object elem for context.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionVideoView(elem: object) {
        let video_settings: string = "";
        if (typeof elem["URL"] == "undefined") throw "kennel:Missing required \"URL\" property";
        if (typeof elem["width"] == "undefined") throw "kennel:Missing required \"width\" property";
        if (typeof elem["height"] == "undefined") throw "kennel:Missing required \"height\" property";
        if (typeof elem["cornerRadius"] == "undefined") throw "kennel:Missing required \"cornerRadius\" property";

        if (typeof elem["showPlaybackControls"] == "undefined" || elem["showPlaybackControls"] == true)
            video_settings += "controls ";

        if (elem["autoplay"])
            video_settings += "autoplay ";

        if (elem["loop"])
            video_settings += "loop ";

        return `<div style="text-align: ${Kennel._alignmentResolver(elem["alignment"])};"><video class="nd_max_width" ${video_settings}style="border-radius: ${Kennel._sanitizeDouble(elem["cornerRadius"])}px;" width="${Kennel._sanitizeDouble(elem["width"])}" height="${Kennel._sanitizeDouble(elem["height"])}"><source src="${Kennel._laxSanitize(elem["URL"])}"></video></div>`;
    }
    /**
     * _DepictionBannersView(elem)
     * Renders a DepictionBannersView, given Object elem for context.
     * Sileo calls this a "FeaturedBannersView" but inconsistency is bothersome.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionBannersView(elem: object) {
        let i: number, size: string[], x: number, y: number, imgURL: string, pkgURL: string, isShadow: string, text: string;
        let ret: string = `<div class="nd_scroll_view">`;
        let sizeStr: string = "";
        let sizeFactor: number = 0.75;

        if (typeof elem["itemSize"] == "undefined") throw "kennel:Missing required \"itemSize\" property";
        if (typeof elem["itemCornerRadius"] == "undefined") throw "kennel:Missing required \"itemCornerRadius\" property";
        if (typeof elem["banners"] == "undefined") throw "kennel:Missing required \"banners\" property";

        if (typeof elem["hideShadow"] == "undefined")
            isShadow = "nd_text_shadow";
        else
            isShadow = elem["hideShadow"] ? "" : "nd_text_shadow";

        size = elem["itemSize"].substring(1, elem["itemSize"].length-1).split(",");
        x = Number(size[0]) * sizeFactor;
        y = Number(size[1]) * sizeFactor;

        sizeStr = `width: ${Kennel._sanitizeDouble(x)}px; height: ${Kennel._sanitizeDouble(y)}px;`;

        for (i = 0; i < elem["banners"].length; i++) {
            if (typeof elem["banners"][i]["url"] == "undefined") throw "kennel:Missing required \"url\" property in banner object.";
            if (typeof elem["banners"][i]["title"] == "undefined") throw "kennel:Missing required \"title\" property in banner object.";
            if (typeof elem["banners"][i]["package"] == "undefined") throw "kennel:Missing required \"package\" property in banner object.";

            imgURL = Kennel._laxSanitize(`${this.#proxyURL}${elem["banners"][i]["url"]}`);
            pkgURL = this.#packagePrefix + Kennel._laxSanitize(elem["banners"][i]["package"]);

            if (typeof elem["displayText"] == "undefined" || elem["displayText"])
                text = `<p class="${isShadow} nd_truncate" style="width: ${Kennel._sanitizeDouble(x - 10)}px">${Kennel._sanitize(elem["banners"][i]["title"])}</p>`;
            else
                text = "";

            ret += `<a class="nd_card" style="background-image: url(${imgURL}); border-radius: ${Kennel._sanitizeDouble(elem["itemCornerRadius"])}px; ${sizeStr}" href="${pkgURL}">${text}</a>`;
        }
        ret += "</div>";

        return ret;
    }
    /**
     * _DepictionAdmobView(elem)
     * Renders a DepictionAdmobView, given Object elem for context.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionAdmobView(elem: object) {
        // Do not render ad views. However, still err for them as per spec (and for those debugging them).
        if (typeof elem["adUnitID"] == "undefined") throw "kennel:Missing required \"adUnitID\" property";
        return "";
    }
    /**
     * _DepictionUnknownView(elem)
     * Renders a DepictionUnknownView, given Object elem for context.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionUnknownView(elem: object) {
        if (this.#silenceErrors)
            return "";
        else
            return `<p style="opacity:0.3">[Could not render: ${Kennel._sanitize(elem["class"])}]</p>`;
    }

    /**
     * _DepictionErrorView(elem)
     * Renders a DepictionUnknownView, given Object elem for context.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     * @param {string} err A string describing the error.
     */
    private _DepictionErrorView(elem: object, err: string) {
        if (this.#silenceErrors)
            return "";
        else
            return `<p style="opacity:0.3;color:red">[${err}: ${Kennel._sanitize(elem["class"])}]</p>`;
    }
    /*
     * _sanitize(str)
     * Aggressive sanitation. All non-alphanum characters are sanitized.
     *
     * @param {string} str A string to sanitize.
     */
    private static _sanitize(str: string) {
        let char: string;
        let newStr: string = "";
        str = String(str);

        for (let i = 0; i < str.length; i++) {
            char = str[i];
            if ((char >= "A" && char <= "z") || (char >= "0" && char <= "9"))
                newStr += char;
            else
                newStr += `&#x${char.charCodeAt(0).toString(16).padStart(4, "0")};`;
        }
        return newStr;
    }
    /*
     * _sanitizeDouble(num)
     * Converts a number to a string and sanitizes it aggressively.
     * All non-numerical, non-decimal values will be removed.
     *
     * @param {number} num A number to sanitize.
     * @return {string} A string of the now-sanitized number.
     */
    private static _sanitizeDouble(num: number) {
        let i: number, char: string;
        let str: string = String(num);
        let newStr: string = "";

        for (i = 0; i < str.length; i++) {
            char = str[i];
            if ((char == ".") || (char >= "0" && char <= "9"))
                newStr += char;
        }
        return newStr;
    }
    /*
     * _sanitizeColor(str)
     * Aggressive sanitation. All non-alphanum characters are sanitized, sans stuff used by colors
     *
     * @param {string} str A string to sanitize.
     */
    private static _sanitizeColor(str: string) {
        let i: number, char: string;
        let newStr: string = "";
        str = String(str);

        for (i = 0; i < str.length; i++) {
            char = str[i];
            if ((char >= "A" && char <= "z") || (char >= "0" && char <= "9") || (char == "#") || (char == ".") || (char == "-") || (char == ",") || (char == "(") || (char == ")"))
                newStr += char;
        }
        return newStr;
    }
    /*
     * _laxSanitize(str)
     * Relaxed sanitation for inside DIVs.
     *
     * @param {string} str A string to sanitize.
     */
    private static _laxSanitize(str: string) {
        let i: number, char: string;
        str = String(str);
        let newStr = "";
        for (i = 0; i < str.length; i++) {
            char = str[i];
            if (
                char === "&" ||
                char === "<" ||
                char === ">" ||
                char === "\"" ||
                char === "\'" ||
                char === "\`" ||
                char === "{" ||
                char === "}" ||
                char === "$" ||
                char === "\\" ||
                char === "/"
            )
                newStr += `&#x${char.charCodeAt(0).toString(16).padStart(4, "0")};`;
            else
                newStr += char;
        }
        return newStr;
    }
    /**
     * _makeIdentifier(prefix)
     * Get a random string to use as a unique identifier.
     *
     * @param {string} prefix A string to prefix the random identifier with.
     */
    private static _makeIdentifier(prefix: string) {
        if (typeof prefix == "undefined")
            prefix = "nd";
        return `${prefix}_${Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(36)}`;
    }
    /**
     * _starString(num)
     * Get a random string to use as a unique identifier.
     *
     * @param {number} num A double of the amount of stars to render.
     */
    private static _starString(num: number) {
        const max = 5;
        num = Math.round(num);
        return "★".repeat(num).padEnd(max, "☆");
    }
    /**
     * _weightStringResolver(str)
     * Resolve a Sileo-recommended font weight to a CSS-compatibile numerical value.
     *
     * @param {string} str Font weight string from native depiction
     */
    private static _weightStringResolver(str: string) {
        if (typeof str == "undefined")
            return "normal";

        str = str.toLowerCase();

        // Suggestions from the W3 spec: https://www.w3.org/TR/CSS2/fonts.html#font-boldness
        switch (str) {
            case "normal":
                return str;
            case "bold":
                return str;
            case "bolder":
                return str;
            case "ultralight":
                return "100";
            case "thin":
                return "200";
            case "light":
                return "300";
            case "book":
                return "400";
            case "semibold":
                return "600";
            case "demibold":
                return "600";
            case "medium":
                return "600";
            case "heavy":
                return "800";
            case "black":
                return "900";
            case "extrablack":
                return "900"
            default:
                return str;
        }
    }
    /**
     * _marginResolver(UIEdgeInsets)
     * Convert a UIEdgeInsets to CSS margins.
     *
     * @param {string} UIEdgeInsets A margins struct from Sileo.
     */
    private static _marginResolver(UIEdgeInsets: string) {
        let arr: number[] = JSON.parse(UIEdgeInsets.replace("{", "[").replace("}", "]"));
        return `margin: ${Kennel._sanitizeDouble(arr[0])}px, ${Kennel._sanitizeDouble(arr[3])}px, ${Kennel._sanitizeDouble(arr[2])}px, ${Kennel._sanitizeDouble(arr[1])}px;`
    }
    /**
     * _alignmentResolver(num)
     * Convert a Sileo AlignEnum to a string that can be used with CSS.
     *
     * @param {number} num A number for horizontal alignment.
     */
    private static _alignmentResolver(num: number) {
        switch (num) {
            case 0:
                return "left";
            case 1:
                return "center";
            case 2:
                return "right";
            default:
                return "left";
        }
    }
    /**
     * _buttonLinkHandler(url, label)
     * Use Parcility to render -depiction links in Sileo.
     *
     * @param {string} url A URL.
     * @param {string} label A string to set as the title for a new depiction's URL.
     */
    private static _buttonLinkHandler(url: string, label: string) {
        // javascript: links should do nothing.
        const jsXssIndex = url.indexOf("javascript:");
        if (jsXssIndex !== -1) {
            return url.substring(0, jsXssIndex) + encodeURIComponent(url.substring(jsXssIndex));
        // depiction- links should link to a depiction. Use Parcility's API for this.
        } else if (url.indexOf("depiction-") == 0) {
            url = url.substring(10);
            if (typeof label == "undefined")
                label = "Depiction";
            return `https://api.parcility.co/render/headerless?url=${encodeURIComponent(url)}&name=${label}`;
        } else if (url.indexOf("form-") == 0) {
            url = url.substring(5);
            return `https://api.parcility.co/render/form?url=${encodeURIComponent(url)}`;
        } else {
            return url;
        }
    }
}
