import type { DepictionBaseView } from ".";
import { makeViews, RenderCtx, renderViews } from "./_util";

export default class DepictionLayerView implements DepictionBaseView {
	views: DepictionBaseView[];
	ctx: RenderCtx;

	constructor(dictionary: any, ctx: RenderCtx) {
		this.ctx = ctx;
		console.log(dictionary);
		let rawViews = dictionary["views"];
		if (!Array.isArray(rawViews)) {
			return;
		}
		this.views = makeViews(rawViews, ctx);
	}

	async render(): Promise<HTMLElement> {
		const el = document.createElement("div");
		el.className = "nd-layer";
		const foo = await renderViews(this.views, this.ctx);
		el.append.apply(el, foo);
		return el;
	}

	mounted(el: HTMLElement) {
		let arr = Array.from(el.children);
		let maxHeight = arr.reduce((max, el) => {
			let height = el.getBoundingClientRect().height;
			return height > max ? height : max;
		}, 0);
		el.style.height = maxHeight + "px";
	}
}
