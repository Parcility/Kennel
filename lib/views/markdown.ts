import DOMPurify from "dompurify";
import { marked } from "marked";
import markdownStyles from "../markdown.css?raw";
import { createElement, createRawNode, createShadowedElement, renderElementString, setStyles } from "../renderable";
import { defaultIfNotType, guardIfNotType, makeView } from "../util";
import DepictionBaseView from "./base";
import DepictionSeparatorView from "./separator";

function callMarked(str: string, opt?: any): Promise<string> {
	return new Promise((resolve, reject) =>
		marked(str, opt, (err: any, html: string) => {
			if (err) reject(err);
			else resolve(html);
		})
	);
}

export default class DepictionMarkdownView extends DepictionBaseView {
	markdown: Promise<string>;
	useSpacing: boolean;
	useMargins: boolean;
	useRawFormat: boolean;

	constructor(dictionary: any) {
		super(dictionary);
		let md = guardIfNotType(dictionary["markdown"], "string");
		this.useMargins = defaultIfNotType(dictionary["useMargins"], "boolean", true);
		this.useSpacing = defaultIfNotType(dictionary["useSpacing"], "boolean", true);
		this.useRawFormat = defaultIfNotType(dictionary["useRawFormat"], "boolean", false);
		if (this.useRawFormat) {
			// TODO(XSS): this is very definately vulnerable to XSS attacks.
			this.markdown = callMarked(md, { gfm: false }).then(async (rendered) => {
				let didWarnXSS = false;
				let xssWarn = `<p style="opacity:0.3">[Warning: This depiction may be trying to maliciously run code in your browser.]</p><br>`;
				rendered = rendered.replace(
					/<hr>/gi,
					renderElementString(await makeView(new DepictionSeparatorView(undefined)))
				);
				if (
					rendered.toLowerCase().indexOf("<script>") !== -1 ||
					rendered.toLowerCase().indexOf("</script>") !== -1
				) {
					rendered = rendered
						.replace(/<script>/im, "&lt;script&gt;")
						.replace(/<\/script>/im, "&lt;/script&gt;");

					didWarnXSS = true;
					rendered = `${xssWarn}${rendered}`;
				}
				if (/on([^\s]+?)=/im.test(rendered)) {
					if (!didWarnXSS) {
						rendered = `${xssWarn}${rendered}`;
						didWarnXSS = true;
					}
					rendered = rendered.replace(/on([^\s]+?)=/gi, "onXSSAttempt=");
				}

				return rendered;
			});
		} else {
			// TODO(XSS): this should be XSS-safe
			this.markdown = callMarked(new Option(md).innerHTML, { xhtml: true, gfm: true });
		}
	}

	async make() {
		const resp = await this.markdown;
		let margins = this.useMargins ? 16 : 0;
		let spacing = this.useSpacing ? 13 : 0;
		let bottomSpacing = this.useSpacing ? 13 : 0;
		let el = createShadowedElement({ class: "nd-markdown" }, [
			createRawNode(DOMPurify.sanitize(resp)),
			createElement("style", {}, [markdownStyles]),
		]);
		let styles: any = {
			margin: "0 " + margins + "px",
			"padding-top": spacing + "px",
			"padding-bottom": (bottomSpacing ? bottomSpacing : spacing) + "px",
		};
		// TODO: none of the links actually use this; we need to mutate the markdown rendering to use this.
		if (this.tintColor) styles["--kennel-tint-color"] = this.tintColor;
		setStyles(el, styles);
		return el;
	}
}
