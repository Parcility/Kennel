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

/**
 * Kennel
 * The class that stores and renders a native depiction.
 *
 * @param {object} Depiction Stores the native depiction.
 * @param {string} proxyURL a URL to prepend to all images, ideal for an image proxy server.
 */
export default class Kennel {
    // Declare data types.
    readonly #depiction: object;
    readonly #proxyURL: string;
    readonly #tint: string;

    constructor(depiction: object, proxyURL: string) {
        const dummyDepiction = {"minVersion": "0.1", "tintColor": "#6264D3", "class": "DepictionLabelView", "text": "(This depiction is empty.)"};
        this.#depiction = (typeof depiction != "undefined") ? depiction : dummyDepiction;
        this.#proxyURL = (typeof proxyURL != "undefined") ? proxyURL : "";
        this.#tint = (typeof this.#depiction["tintColor"] != "undefined") ? Kennel._sanitizeColor(this.#depiction["tintColor"]) : "#6264d3";
    }
    /**
     * render()
     * Renders the body of the _Depiction.
     * Does not include any styles. This has to be imported as a CSS file.
     *
     * @return string A string of minified HTML.
     */
    render() {
        // This is the string that will contain everything.
        let buffer = `<div class="native_depiction"><style>a, .nd_tint, .nd_table-btn:after {color: ${this.#tint}} .nd_active {color: ${this.#tint}; border-bottom: 2px solid ${this.#tint};} .nd_btn {background-color: ${this.#tint}}</style>`;
4
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
        // This is where we see what class an element is and
        // subsequently call a function to render it.
        if (elem["class"] == "DepictionStackView")
            return this._DepictionStackView(elem);
        else if (elem["class"] == "DepictionAutoStackView")
            return this._DepictionAutoStackView(elem);
        else if (elem["class"] == "DepictionTabView")
            return this._DepictionTabView(elem);
        else if (elem["class"] == "DepictionTableTextView")
            return this._DepictionTableTextView(elem);
        else if (elem["class"] == "DepictionTableButtonView")
            return this._DepictionTableButtonView(elem);
        else if (elem["class"] == "DepictionMarkdownView")
            return this._DepictionMarkdownView(elem);
        else if (elem["class"] == "DepictionLabelView")
            return this._DepictionLabelView(elem);
        else if (elem["class"] == "DepictionScreenshotsView")
            return this._DepictionScreenshotsView(elem);
        else if (elem["class"] == "DepictionSpacerView")
            return this._DepictionSpacerView(elem);
        else if (elem["class"] == "DepictionSeparatorView")
            return this._DepictionSeparatorView(elem);
        else if (elem["class"] == "DepictionHeaderView")
            return this._DepictionHeaderView(elem);
        else if (elem["class"] == "DepictionSubheaderView")
            return this._DepictionSubheaderView(elem);
        else if (elem["class"] == "DepictionButtonView")
            return this._DepictionButtonView(elem);
        else if (elem["class"] == "DepictionImageView")
            return this._DepictionImageView(elem);
        else if (elem["class"] == "DepictionRatingView")
            return this._DepictionRatingView(elem);
        else if (elem["class"] == "DepictionReviewView")
            return this._DepictionReviewView(elem);
        else if (elem["class"] == "DepictionWebView")
            return this._DepictionWebView(elem);
        else if (elem["class"] == "DepictionVideoView")
            return this._DepictionVideoView(elem);
        else if (elem["class"] == "DepictionAdmobView")
            return this._DepictionAdmobView(elem);
        else if (elem["class"].toLowerCase().indexOf("hidden") != -1)
            return "";
        else
            return this._DepictionUnknownView(elem);
    }
    /**
     * _DepictionTabView(elem)
     * Renders a DepictionTabView, given Object elem for context.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionTabView(elem: object) {
        let buffer = `<div class="nd_tabView">`;

        // Give this TabView a unique ID.
        let tabViewId = Kennel._makeIdentifier("nd_tabView");

        // Render tab selector.
        buffer += `<div class="nd_nav">`;
        for (let i = 0; i < elem["tabs"].length; i++)
            buffer += `<div class="${tabViewId} ${tabViewId}_tab_${i} nd_nav_btn nd_tweak_info_btn ${(i == 0) ? "nd_active" : ""}" onclick="ndChangeTab('.${tabViewId}_tab_${i}', '.${tabViewId}')">${Kennel._sanitize(elem["tabs"][i].tabname)}</div>`;
        buffer += `</div>`;

        // Render the tabs themselves
        buffer += `<div>`;
        for (let i = 0; i < elem["tabs"].length; i++) {
            // Be consistent on our use of random IDs!
            buffer += `<div class="nd_tab ${tabViewId} ${`${tabViewId}_tab_${i}`} ${i > 0 ? "nd_hidden" : ""}">`;
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
        let buffer = "";

        if (typeof elem["backgroundColor"] != "undefined")
            buffer += `<div class="nd_nested_stack" style="background: ${Kennel._sanitize(elem["backgroundColor"])}">`;
        else
            buffer += `<div class="nd_nested_stack">`;

        if (typeof elem["orientation"] == "undefined" || elem["orientation"].toLowerCase() != "landscape") {
            // Standard orientation
            for (let i = 0; i < elem["views"].length; i++)
                buffer += this._DepictionBaseView(elem["views"][i]);
        } else {
            // "Landscape" orientation, or causing StackViews to be next to each other.
            buffer += `<div class="nd_landscape_stack">`;
            for (let i = 0; i < elem["views"].length; i++)
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
        let buffer = "";
        if (typeof elem["backgroundColor"] != "undefined")
            buffer += `<div class="nd_nested_stack" style="background: ${Kennel._sanitize(elem["backgroundColor"])}; width: ${Kennel._sanitize(elem["horizontalSpacing"] ? `${elem["horizontalSpacing"]}px` : "100%")}">`;
        else
            buffer += `<div class="nd_nested_stack" style="width: ${Kennel._sanitize(elem["horizontalSpacing"] ? `${elem["horizontalSpacing"]}px` : "100%")}">`;

        if (typeof elem["orientation"] == "undefined" || elem["orientation"].toLowerCase() != "landscape") {
            // Standard orientation
            for (let i = 0; i < elem["views"].length; i++)
                buffer += this._DepictionBaseView(elem["views"][i]);
        } else {
            // "Landscape" orientation, or causing StackViews to be next to each other.
            buffer += `<div class="nd_landscape_stack">`;
            for (let i = 0; i < elem["views"].length; i++)
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
        let extra_params = "";
        if (elem["openExternal"]) {
            extra_params += ` target="_blank"`;
        }
        if (elem["yPadding"] || elem["tintColor"]) {
            extra_params += ` style="`;
            if (elem["yPadding"])
                extra_params += `padding-bottom: '${Kennel._sanitize(elem["yPadding"])}';`;
            if (elem["tintColor"]) {
                // !TODO Fix bug where the chevron will stay uncolored.
                extra_params += `color: ${Kennel._sanitizeColor(elem["tintColor"])};`;
            }
            extra_params += `"`;
        }
        elem["action"] = Kennel._sanitize(Kennel._buttonLinkHandler(elem["action"], elem["title"]));
        return `<a class="nd nd_table-btn" href="${elem["action"]}"${extra_params}><div>${elem["title"]}</div></a>`;
    }
    /**
     * _DepictionButtonView(elem)
     * Renders a DepictionButtonView, given Object elem for context.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionButtonView(elem: object) {
        let extra_params = "";
        if (elem["openExternal"]) {
            extra_params += ` target="_blank"`;
        }
        if (elem["yPadding"] || elem["tintColor"]) {
            extra_params += ` style="`;
            if (elem["yPadding"])
                extra_params += `padding-bottom: '${Kennel._sanitize(elem["yPadding"])}';`;
            if (elem["tintColor"]) {
                extra_params += `background-color: ${Kennel._sanitizeColor(elem["tintColor"])};`;
            }
            extra_params += `"`;
        }
        elem["action"] = Kennel._sanitize(Kennel._buttonLinkHandler(elem["action"], elem["text"]));
        return `<a class="nd nd_btn" href="${elem["action"]}"${extra_params}>${elem["text"]}</a>`;
    }
    /**
     * _DepictionMarkdownView(elem)
     * Renders a DepictionMarkdownView, given Object elem for context.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionMarkdownView(elem: object) {
        let ident = Kennel._makeIdentifier("md");
        // Is there a tint color passed?
        if (typeof elem["tintColor"] == "undefined" && typeof this.#tint == "undefined")
            elem["tintColor"] = "#6264D3";
        else if (typeof elem["tintColor"] == "undefined" && typeof this.#tint != "undefined")
            elem["tintColor"] = this.#tint;

        let xssWarn = `<p style="opacity:0.3">[Warning: This depiction may be trying to maliciously run code in your browser.]</p><br>`

        let rendered;
        if (elem["useRawFormat"]) {
            // ! XSS WARNING ! //
            // Unfortunately, this is a design flaw with the spec.
            rendered = marked(elem["markdown"]).replace(/<hr>/g, this._DepictionSeparatorView(elem));

            // Remove all <script> tags.
            if (rendered.toLowerCase().indexOf("<script>") != -1) {
                // If <script> is detected,
                rendered = `${xssWarn}${rendered}`;
                rendered = rendered.substring(0, rendered.toLowerCase().indexOf("<script>") + 7) + rendered.substring(rendered.toLowerCase().indexOf("</script>"));
            }
            // Clumbsily remove onerr/onload
            if (
                rendered.toLowerCase().indexOf("onload") != -1 ||
                rendered.toLowerCase().indexOf("onerror") != -1 ||
                rendered.toLowerCase().indexOf("onhover") != -1 ||
                rendered.toLowerCase().indexOf("onclick") != -1
            )
            {
                rendered = `${xssWarn}${rendered}`;
                rendered = rendered.replace(/onload/i, "").replace(/onerror/i, "").replace(/onhover/i, "").replace(/onclick/i, "")
            }

        } else {
            rendered = marked(Kennel._lax_sanitize(elem["markdown"])).replace(/<hr>/g, this._DepictionSeparatorView(elem));
        }
        let noJSRender;

        // Use <script> to help build the shadow DOM, as we're sending this to a page that is
        // yet to load.
        if (rendered.indexOf("<style>") != -1) {
            // This render includes a style element! Let's make sure it's accounted for properly!
            // *because shadow DOMs can't have body tags, so we gotta do some editing.
            let newStyleEl = rendered.substring(rendered.indexOf("<style>") + 7, rendered.indexOf("</style>"))
            newStyleEl = newStyleEl.replace(/body/g, "root").replace(/html/g, "root");
            rendered = rendered.substring(0, rendered.indexOf("<style>") + 7) + newStyleEl + rendered.substring(rendered.indexOf("</style>"));

            // JS-free rendering.
            noJSRender = rendered.substring(0, rendered.indexOf("<style>")) + rendered.substring(rendered.indexOf("</style>") + 8);
        } else {
            noJSRender = rendered;
        }

        // Return the JavaScript code needed to create the shadow DOM.
        // I know this is a very long line, but all functions shall output minified JS, and the
        // extra time it costs to remove the whitespaces programatically isn't worth it.
        return `<div id="${ident}" class="nd_md_view"><noscript>${noJSRender}</noscript><script>mdEl = document.createElement("sandboxed-markdown");let shadowRoot = mdEl.attachShadow({mode: 'open'});shadowRoot.innerHTML = \`<style>a {color:${Kennel._sanitizeColor(elem["tintColor"])};text-decoration: none} a:hover {opacity:0.8} h1, h2, h3, h4, h5, h6, p {margin-top: 5px; margin-bottom: 5px;}</style><root>${rendered}</root>\`;el = document.getElementById("${ident}");el.appendChild(mdEl);el.removeAttribute("id");el.removeChild(el.children[0]);el.removeChild(el.children[0]);</script></div>`;
    }
    /**
     * _DepictionLabelView(elem)
     * Renders a DepictionLabelView, given Object elem for context.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionLabelView(elem: object) {
        let marginStr;
        if (typeof elem["margins"] != "undefined")
            marginStr = Kennel._marginResolver(elem["margins"]);
        else
            marginStr = "";

        elem["alignment"] = Kennel._alignmentResolver(elem["alignment"]);
        elem["fontWeight"] = Kennel._weightStringResolver(elem["fontWeight"]);
        elem["textColor"] = (typeof elem["textColor"] != "undefined")
            ? `color: ${Kennel._sanitize(elem["textColor"])};` : "";
        elem["fontSize"] = (typeof elem["fontSize"] != "undefined")
            ? `font-size: ${Kennel._sanitize(elem["fontSize"])}px;` : "";

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
        let ret = `<div class="nd_scroll_view">`
        let size = elem["itemSize"].substring(1, elem["itemSize"].length-1).split(",");
        let x = Number(size[0]);
        let y = Number(size[1]);
        let sizeStr = "";

        if (x > y) {
            sizeStr = `width: ${Kennel._sanitize(x)}px`;
        } else {
            sizeStr = `height: ${Kennel._sanitize(y)}px`;
        }

        for (let i = 0; i < elem["screenshots"].length; i++) {
            let ssURL = Kennel._lax_sanitize(`${this.#proxyURL}${elem["screenshots"][i].url}`);
            ret += `<img style="${Kennel._sanitize(sizeStr)}; border-radius: ${Kennel._sanitize(elem["itemCornerRadius"])}px" class="nd_img_card" alt="${Kennel._sanitize(elem["screenshots"][i].accessibilityText)}" src="${ssURL}">`;
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
        return `<div class="nd_br" style="padding-top: ${elem["spacing"]}px"></div>`;
    }
    /**
     * _DepictionSeparatorView(elem)
     * Renders a DepictionSeparatorView, given Object elem for context.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionSeparatorView(elem: object) {
        return `<div class="nd_hr_wrap"><hr></div>`;
    }
    /**
     * _DepictionHeaderView(elem)
     * Renders a DepictionHeaderView, given Object elem for context.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionHeaderView(elem: object) {
        elem["fontWeight"] = "bold";
        if (typeof elem["useBoldText"] != "undefined") {
            elem["fontWeight"] = elem["useBoldText"] ? "bold" : "normal";
        }
        return `<h3 class="nd_header" style="text-align: ${Kennel._alignmentResolver(elem["alignment"])};font-weight: ${Kennel._sanitize(elem["fontWeight"])}">${Kennel._sanitize(elem["title"])}</h3>`;
    }
    /**
     * _DepictionSubheaderView(elem)
     * Renders a DepictionSubheaderView, given Object elem for context.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionSubheaderView(elem: object) {
        elem["fontWeight"] = "normal";
        if (typeof elem["useBoldText"] != "undefined") {
            elem["fontWeight"] = elem["useBoldText"] ? "bold" : "normal";
        }
        return `<h4 class="nd_header" style="text-align: ${Kennel._alignmentResolver(elem["alignment"])};font-weight: ${Kennel._sanitize(elem["fontWeight"])}">${Kennel._sanitize(elem["title"])}</h4>`;
    }
    /**
     * _DepictionImageView(elem)
     * Renders a DepictionImageView, given Object elem for context.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionImageView(elem: object) {
        let url = Kennel._lax_sanitize(`${this.#proxyURL}${elem["URL"]}`); // Use proxy server (if set).
        let padding = (typeof elem["horizontalPadding"] != "undefined" ? `padding-top:${Kennel._sanitize(elem["horizontalPadding"])}px;padding-bottom:${Kennel._sanitize(elem["horizontalPadding"])}px;` :"");
        elem["alignment"] = Kennel._alignmentResolver(elem["alignment"]);
        return `<div style="text-align:${elem["alignment"]};"><img src="${url}" style="width:${Kennel._sanitize(elem["width"])}px;height:${Kennel._sanitize(elem["height"])}px;border-radius:${Kennel._sanitize(elem["cornerRadius"])}px;max-width:100%;${padding}" alt="Image from depiction."></div>`;
    }
    /**
     * _DepictionRatingView(elem)
     * Renders a DepictionRatingView, given Object elem for context.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionRatingView(elem: object) {
        let stars = Kennel._starString(elem["rating"]);
        elem["alignment"] = Kennel._alignmentResolver(elem["alignment"]);
        return `<div style="color:#a1a1a1; text-align:${elem["alignment"]};">${stars}</div>`;
    }
    /**
     * _DepictionReviewView(elem)
     * Renders a DepictionReviewView, given Object elem for context.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionReviewView(elem: object) {
        let md = this._DepictionMarkdownView(elem);
        let ratingStr;
        if (typeof elem["rating"] != "undefined")
            ratingStr = this._DepictionRatingView(elem);
        else
            ratingStr = "";
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
        elem["alignment"] = Kennel._alignmentResolver(elem["alignment"]);
        // Only work if the website is whitelisted. Use regex.
        if (/(https?\:\/\/(((.*)\.vimeo.com)|(vimeo.com)|((.*)\.youtube.com)|(youtube.com))\/)/g.test(elem["URL"]))
            // Bug: Ignores alignment.
            return `<div style="text-align: ${elem["alignment"]}"><iframe class="nd_max_width" src="${Kennel._lax_sanitize(elem["URL"])}" style="width: ${Kennel._sanitize(elem["width"])}px; height: ${Kennel._sanitize(elem["height"])}px;"></iframe></div>`;
        else
            return "";
    }
    /**
     * _DepictionVideoView(elem)
     * Renders a DepictionVideoView, given Object elem for context.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionVideoView(elem: object) {
        return `<div style="text-align: ${Kennel._alignmentResolver(elem["alignment"])};"><video class="nd_max_width" controls style="border-radius: ${Kennel._sanitize(elem["cornerRadius"])}px;" src="${Kennel._lax_sanitize(elem["URL"])}" width="${Kennel._sanitize(elem["width"])}" height="${Kennel._sanitize(elem["height"])}"></video></div>`;
    }
    /**
     * _DepictionAdmobView(elem)
     * Renders a DepictionAdmobView, given Object elem for context.
     * Calling directly is not recommended but is possible.
     *
     * @param {object} elem The native depiction class.
     */
    private _DepictionAdmobView(elem: object) {
        // Do not render ad views.
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
        return `<p style="opacity:0.3">[Could not render: ${Kennel._sanitize(elem["class"])}]</p>`;
    }
    /**
     * _sanitizeAll(str)
     * Aggressive sanitation. All characters are _sanitized.
     *
     * @param {string} str A string to sanitize.
     */
    private static _sanitizeAll(str) {
        str = String(str);
        let newStr = "";
        for (let i = 0; i < str.length; i++) {
            newStr += `&#x${Kennel._zeroPad(str.charCodeAt(i).toString(16))};`;
        }
        return newStr;
    }
    /*
     * _sanitize(str)
     * Aggressive sanitation. All non-alphanum characters are _sanitized.
     *
     * @param {string} str A string to sanitize.
     */
    private static _sanitize(str) {
        str = String(str);
        let newStr = "";
        for (let i = 0; i < str.length; i++) {
            let char = str[i];
            if ((char >= "A" && char <= "z") || (char >= "0" && char <= "9"))
                newStr += char;
            else
                newStr += `&#x${Kennel._zeroPad(char.charCodeAt(0).toString(16))};`;
        }
        return newStr;
    }
    /*
     * _sanitizeColor(str)
     * Aggressive sanitation. All non-alphanum characters are _sanitized, sans stuff used by colors
     *
     * @param {string} str A string to sanitize.
     */
    private static _sanitizeColor(str) {
        str = String(str);
        let newStr = "";
        for (let i = 0; i < str.length; i++) {
            let char = str[i];
            if ((char >= "A" && char <= "z") || (char >= "0" && char <= "9") || (char == "#") || (char == "(") || (char == ")"))
                newStr += char;
            else
                newStr += `&#x${Kennel._zeroPad(char.charCodeAt(0).toString(16))};`;
        }
        return newStr;
    }
    /*
     * _lax_sanitize(str)
     * Relaxed sanitation for inside DIVs.
     *
     * @param {string} str A string to sanitize.
     */
    private static _lax_sanitize(str: string) {
        str = String(str);
        let newStr = "";
        for (let i = 0; i < str.length; i++) {
            let char = str[i];
            if (
                char == "&" ||
                char == "<" ||
                char == ">" ||
                char == "\"" ||
                char == "\'" ||
                char == "\`" ||
                char == "\\" ||
                char == "/"
            )
                newStr += `&#x${Kennel._zeroPad(char.charCodeAt(0).toString(16))};`;
            else
                newStr += char;
        }
        return newStr;
    }
    /**
     * _sanitizeLegal(str)
     * Aggressive sanitation designed for attributes. All non-legal are rendered as
     * underscore-padded hex numbers.
     *
     * @param {string} str A string to sanitize.
     */
    private static _sanitizeLegal(str: string) {
        str = String(str);
        let newStr = "";
        for (let i = 0; i < str.length; i++) {
            let char = str[i];
            if ((char >= "A" && char <= "z") || (char >= "0" && char <= "9"))
                newStr += char;
            else
                newStr += `_${Kennel._zeroPad(char.charCodeAt(0).toString(16))}`;
        }
        return newStr;
    }
    /**
     * _zeroPad(char)
     * Pad a number char with, at most, four zeros.
     *
     * @param {string} char A single character.
     */
    private static _zeroPad(char: string) {
        let len = String(char).length;
        if (len == 0)
            return "0000";
        if (len == 1)
            return "000" + char;
        if (len == 2)
            return "00" + char;
        if (len == 3)
            return "0" + char;
        else
            return char;
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
        let buffer = "";
        let max = 5;
        let i;
        for (i = 0; i < Math.floor(num); i++)
            buffer += "★";
        if (num % 1 != 0)
            buffer += "★";
        for (i = Math.ceil(num); i < max; i++)
            buffer += "☆";
        return buffer;
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
        if (str == "normal" || str == "bold" || str == "bolder" || str == "lighter")
            return str;
        else if (str == "ultralight")
            return "100";
        else if (str == "thin")
            return "200";
        else if (str == "light")
            return "300";
        else if (str == "book")
            return "400";
        else if (str == "semibold" || str == "Demibold" || str == "medium")
            return "600";
        else if (str == "heavy")
            return "800";
        else if (str == "black" || str == "extrablack")
            return "900";
    }
    /**
     * _marginResolver(UIEdgeInsets)
     * Convert a UIEdgeInsets to CSS margins.
     *
     * @param {string} UIEdgeInsets A margins struct from Sileo.
     */
    private static _marginResolver(UIEdgeInsets: string) {
        let arr = JSON.parse(UIEdgeInsets.replace("{", "[").replace("}", "]"));
        return `margin: ${arr[0]}px, ${arr[3]}px, ${arr[2]}px, ${arr[1]}px;`
    }
    /**
     * _alignmentResolver(num)
     * Convert a Sileo AlignEnum to a string that can be used with CSS.
     *
     * @param {number} num A number for horizontal alignment.
     */
    private static _alignmentResolver(num: number) {
        if (num == 0)
            return "left";
        else if (num == 1)
            return "center";
        else if (num == 2)
            return "right";
        else
            return "left";
    }
    /**
     * _buttonLinkHandler(url, label)
     * Use Parcility to render depiction- links in Sileo.
     *
     * @param {string} url A URL.
     * @param {string} label A string to set as the title for a new depiction's URL.
     */
    // Allow for -_Depiction links to work, too!
    private static _buttonLinkHandler(url: string, label: string) {
        if (url.indexOf("depiction-") == 0) {
            url = url.substring(10);

            if (typeof label == "undefined")
                label = "Depiction";

            return `https://api.parcility.co/render/headerless?url=${url}&name=${label}`
        } else if (url.indexOf("form-") == 0) {
            return url.substring(4);
        } else {
            return url;
        }
    }
}