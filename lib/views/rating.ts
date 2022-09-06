import { createElement, RenderableElement, setStyles } from "../renderable";
import { guardIfNotType, textAlignment } from "../util";
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
	static viewName = "DepictionRatingView";

	constructor(dictionary: any) {
		super(dictionary);
		this.rating = guardIfNotType(dictionary["rating"], "number");
		this.alignment = textAlignment(guardIfNotType(dictionary["alignment"], "number"));
	}

	async make() {
		return makeRatingElement(this.rating, this.alignment);
	}
}
