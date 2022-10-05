import { RenderOptions, createElement, RenderableElement, setStyles } from "../renderable";
import { guardIfNotType, makeView, undefIfNotType } from "../util";
import DepictionBaseView from "./base";
import DepictionMarkdownView from "./markdown";
import { makeRatingElement } from "./rating";

export default class DepictionReviewView extends DepictionBaseView {
	title: string;
	author: string;
	rating?: number;
	markdown: DepictionMarkdownView;
	static viewName = "DepictionReviewView";

	constructor(
		dictionary: any,
		options?: Partial<RenderOptions>
	) {
		super(dictionary, options);
		this.title = guardIfNotType(dictionary["title"], "string");
		this.author = guardIfNotType(dictionary["author"], "string");
		let markdown = guardIfNotType(dictionary["markdown"], "string");
		this.markdown = new DepictionMarkdownView({ markdown, useSpacing: false, useMargins: false }, options);
		this.rating = undefIfNotType(dictionary["rating"], "number");
	}

	async make() {
		const titleEl = createElement("p", { class: "nd-review-title" }, [this.title]);
		const subtitleEl = createElement("div", { class: "nd-review-subtitle" });
		const authorEl = createElement("p", { class: "nd-review-author" }, ["by ", this.author]);
		let md = await this.markdown;
		const contentEl = createElement("p", { class: "nd-review-content" }, [await makeView(md)]);
		if (this.tintColor) setStyles(contentEl, { "--kennel-tint-color": this.tintColor });
		subtitleEl.children = [authorEl, this.rating && makeRatingElement(this.rating, "left")].filter(
			Boolean
		) as RenderableElement[];
		const el = createElement("div", { class: "nd-review" }, [titleEl, subtitleEl, contentEl]);
		return el;
	}
}
