import DOMPurify from "dompurify";
import { marked } from "marked";
import type { DepictionBaseView } from ".";
import { defaultIfNotType, guardIfNotType, RenderCtx } from "../util";

export default class DepictionMarkdownView implements DepictionBaseView {
	markdown: Promise<string>;
	useSpacing: boolean;
	useMargins: boolean;
	ctx: RenderCtx;

	constructor(dictionary: any, ctx: RenderCtx) {
		this.ctx = ctx;
		let md = guardIfNotType(dictionary["markdown"], "string");
		this.useMargins = defaultIfNotType(dictionary["useMargins"], "boolean", true);
		this.useSpacing = defaultIfNotType(dictionary["useSpacing"], "boolean", true);

		this.markdown = new Promise((resolve, reject) =>
			marked(md, {}, (err: any, html: string) => {
				if (err) return reject(err);
				resolve(html);
			})
		);
	}

	async render(): Promise<HTMLElement> {
		const resp = await this.markdown;
		const el = new MarkdownElement(resp);
		let margins = this.useMargins ? 16 : 0;
		let spacing = this.useSpacing ? 13 : 0;
		let bottomSpacing = this.useSpacing ? 13 : 0;
		el.style.margin = margins + "px";
		el.style.padding = spacing + "px";
		el.style.paddingBottom = bottomSpacing + "px";
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
