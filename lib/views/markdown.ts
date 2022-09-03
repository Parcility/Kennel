import DOMPurify from "dompurify";
import { marked } from "marked";
import type { DepictionBaseView } from ".";
import { defaultIfNotType, guardIfNotType, RenderCtx } from "../util";
import DepictionSeparatorView from "./separator";

export function callMarked(str: string, opt?: any): Promise<string> {
	return new Promise((resolve, reject) =>
		marked(str, opt, (err: any, html: string) => {
			if (err) reject(err);
			else resolve(html);
		})
	);
}

export default class DepictionMarkdownView implements DepictionBaseView {
	markdown: Promise<string>;
	useSpacing: boolean;
	useMargins: boolean;
	useRawFormat: boolean;
	ctx: RenderCtx;

	constructor(dictionary: any, ctx: RenderCtx) {
		this.ctx = ctx;
		let md = guardIfNotType(dictionary["markdown"], "string");
		this.useMargins = defaultIfNotType(dictionary["useMargins"], "boolean", true);
		this.useSpacing = defaultIfNotType(dictionary["useSpacing"], "boolean", true);
		this.useRawFormat = defaultIfNotType(dictionary["useRawFormat"], "boolean", false);
		if (this.useRawFormat) {
			// ! BEWARE OF XSS ! //
			// Unfortunately, this is a design flaw with the spec.
			// TODO: Just disable link parsing. This is non-trivial to do, so for now, we just disable GFM-flavored Markdown for useRawFormat.

			this.markdown = callMarked(md, { gfm: false }).then((rendered) => {
				let didWarnXSS = false;
				let xssWarn = `<p style="opacity:0.3">[Warning: This depiction may be trying to maliciously run code in your browser.]</p><br>`;
				rendered = rendered.replace(
					/<hr>/gi,
					new DepictionSeparatorView(undefined, new Map()).render().outerHTML
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
			return;
		}

		this.markdown = callMarked(new Option(md).innerHTML, { xhtml: true, gfm: true });
	}

	async render(): Promise<HTMLElement> {
		const resp = await this.markdown;
		const el = new MarkdownElement(resp);
		let margins = this.useMargins ? 16 : 0;
		let spacing = this.useSpacing ? 13 : 0;
		let bottomSpacing = this.useSpacing ? 13 : 0;
		el.style.margin = margins + "px";
		el.style.paddingTop = spacing + "px";
		el.style.paddingBottom = (bottomSpacing ? bottomSpacing : spacing) + "px";
		return el;
	}
}

class MarkdownElement extends HTMLElement {
	root: HTMLElement | ShadowRoot;

	set content(newValue) {
		this.root.innerHTML = newValue;
	}

	constructor(md?: string) {
		super();
		let shadow = this.attachShadow({ mode: "open" });
		this.root = shadow;
		if (md) this.root.innerHTML = DOMPurify.sanitize(md);
	}
}

self.customElements.define("nd-markdown", MarkdownElement);
