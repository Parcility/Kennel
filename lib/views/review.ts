import DOMPurify from "dompurify";
import { createElement, createShadowedElement, RenderableElement } from "../renderable";
import { guardIfNotType, RenderCtx, undefIfNotType } from "../util";
import DepictionBaseView from "./base";
import DepictionMarkdownView, { callMarked } from "./markdown";
import { makeRatingElement } from "./rating";

export default class DepictionReviewView extends DepictionBaseView {
	title: string;
	author: string;
	rating?: number;
	markdown: DepictionMarkdownView;

	constructor(dictionary: any, ctx: RenderCtx) {
		super(dictionary, ctx);
		this.title = guardIfNotType(dictionary["title"], "string");
		this.author = guardIfNotType(dictionary["author"], "string");
		let markdown = guardIfNotType(dictionary["markdown"], "string");
		this.markdown = new DepictionMarkdownView({ markdown, useSpacing: false, useMargins: false }, this.ctx);
		this.rating = undefIfNotType(dictionary["rating"], "number");
	}

	async make() {
		const titleEl = createElement("p", { class: "nd-review-title" }, [this.title]);
		const subtitleEl = createElement("div", { class: "nd-review-subtitle" });
		const authorEl = createElement("p", { class: "nd-review-author" }, ["by " + this.author]);
		let md = await this.markdown;
		const contentEl = createElement("p", { class: "nd-review-content" }, [await md.make()]);
		subtitleEl.children = [authorEl, this.rating && makeRatingElement(this.rating, "left")].filter(
			Boolean
		) as RenderableElement[];
		const el = createElement("div", { class: "nd-review" }, [titleEl, subtitleEl, contentEl]);
		return el;
	}
}
