import { createElement } from "../renderable";
import { constructViews, guardIfNotType, makeViews } from "../util";
import DepictionBaseView from "./base";

export default class DepictionLayerView extends DepictionBaseView {
	views: DepictionBaseView[];

	constructor(dictionary: any) {
		super(dictionary);
		let rawViews = guardIfNotType(dictionary["views"], "array");
		this.views = constructViews(rawViews);
	}

	async make() {
		const el = createElement("div", { class: "nd-layer" });
		el.children = await makeViews(this.views);
		return el;
	}

	static hydrate(el: HTMLElement) {
		console.log("hydrating", el);
		let arr = Array.from(el.children);
		let maxHeight = arr.reduce((max, el) => {
			let height = el.getBoundingClientRect().height;
			return height > max ? height : max;
		}, 0);
		el.style.height = maxHeight + "px";
	}
}
