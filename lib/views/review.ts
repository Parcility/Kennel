import DOMPurify from "dompurify";
import type { DepictionBaseView } from ".";
import { Alignment, getAlignment, guardIfNotType, RenderCtx, textAlignment, undefIfNotType } from "../util";
import { callMarked } from "./markdown";
import { makeRatingElement } from "./rating";

export default class DepictionRatingView implements DepictionBaseView {
	ctx: RenderCtx;
	title: string;
	author: string;
	rating?: number;
	markdown: Promise<string>;

	constructor(dictionary: any, ctx: RenderCtx) {
		console.log("RATING VIEw", dictionary);
		this.ctx = ctx;
		this.title = guardIfNotType(dictionary["title"], "string");
		this.author = guardIfNotType(dictionary["author"], "string");
		this.markdown = callMarked(guardIfNotType(dictionary["markdown"], "string"));
		this.rating = undefIfNotType(dictionary["rating"], "number");
	}

	async render(): Promise<HTMLElement> {
		const el = document.createElement("div");
		el.className = "nd-review";
		const titleEl = document.createElement("p");
		titleEl.className = "nd-review-title";
		titleEl.innerHTML = this.title;
		const subtitleEl = document.createElement("div");
		subtitleEl.className = "nd-review-subtitle";
		const authorEl = document.createElement("p");
		authorEl.className = "nd-review-author";
		authorEl.innerHTML = "by " + this.author;
		const contentEl = document.createElement("p");
		contentEl.className = "nd-review-content";
		let md = await this.markdown;
		contentEl.innerHTML = DOMPurify.sanitize(md);
		el.appendChild(titleEl);
		subtitleEl.appendChild(authorEl);
		if (this.rating) {
			const ratingEl = makeRatingElement(this.rating, "right");
			subtitleEl.appendChild(ratingEl);
		}
		el.appendChild(subtitleEl);
		el.appendChild(contentEl);
		return el;
	}
}
