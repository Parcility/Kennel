import { createElement, RenderableElement, setStyles } from "../renderable";
import { guardIfNotType, RenderCtx, textAlignment } from "../util";
import DepictionBaseView from "./base";

export function makeRatingElement(progress: number, alignment: string): RenderableElement {
	const el = createElement("div", { class: "nd-rating" });
	setStyles(el, {
		"text-align": alignment,
		"--kennel-rating-progress": progress * 20 + "%",
	});
	el.children = [createElement("span", {}, ["★★★★★"])];
	return el;
}

export default class DepictionRatingView extends DepictionBaseView {
	rating: number;
	alignment: string;

	constructor(dictionary: any, ctx: RenderCtx) {
		super(dictionary, ctx);
		this.rating = guardIfNotType(dictionary["rating"], "number");
		this.alignment = textAlignment(guardIfNotType(dictionary["alignment"], "number"));
		console.log(this.alignment, dictionary["alignment"]);
	}

	async make() {
		return makeRatingElement(this.rating, this.alignment);
	}
}
