import type { DepictionBaseView } from ".";
import { Alignment, getAlignment, guardIfNotType, RenderCtx, textAlignment } from "../util";

export function makeRatingElement(progress: number, alignment: string): HTMLElement {
	const el = document.createElement("div");
	el.className = "nd-rating";
	el.style.textAlign = alignment;
	el.style.setProperty("--kennel-rating-progress", progress * 20 + "%");
	const textEl = document.createElement("span");
	textEl.innerHTML = "★★★★★";
	el.appendChild(textEl);
	return el;
}

export default class DepictionRatingView implements DepictionBaseView {
	ctx: RenderCtx;
	rating: number;
	alignment: string;

	constructor(dictionary: any, ctx: RenderCtx) {
		console.log("RATING VIEw", dictionary);
		this.ctx = ctx;
		this.rating = guardIfNotType(dictionary["rating"], "number");
		this.alignment = textAlignment(guardIfNotType(dictionary["alignment"], "number"));
	}

	render(): HTMLElement {
		return makeRatingElement(this.rating, this.alignment);
	}
}
