import { createElement } from "../renderable";
import { guardIfNotType, makeViews, RenderCtx, renderViews } from "../util";
import DepictionBaseView from "./base";

export default class DepictionLayerView extends DepictionBaseView {
	views: DepictionBaseView[];

	constructor(dictionary: any, ctx: RenderCtx) {
		super(dictionary, ctx);
		let rawViews = guardIfNotType(dictionary["views"], "array");
		this.views = makeViews(rawViews, ctx);
	}

	async make() {
		const el = createElement("div", { class: "nd-layer" });
		el.children = await Promise.all(this.views.map((v) => v.make()));
		return el;
	}

	mounted = (el: HTMLElement) => {
		let arr = Array.from(el.children);
		let maxHeight = arr.reduce((max, el) => {
			let height = el.getBoundingClientRect().height;
			return height > max ? height : max;
		}, 0);
		el.style.height = maxHeight + "px";
	};
}
