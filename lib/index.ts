import "./index.css";
import { DepictionBaseView, views } from "./views";
import { makeViews, RenderCtx, renderViews } from "./views/_util";

export default class Kennel {
	#depiction: any;
	#processed: DepictionBaseView[];
	#ctx: RenderCtx = new Map();

	constructor(depiction: any) {
		this.#depiction = depiction;
		console.time("process");
		if (Array.isArray(this.#depiction.views)) {
			this.#processed = makeViews(this.#depiction.views, this.#ctx);
		}
		console.timeEnd("process");
	}

	async render(target?: HTMLElement): Promise<HTMLElement> {
		console.time("render");
		let el = document.createElement("div");
		const views = await renderViews(this.#processed, this.#ctx);
		el.append.apply(el, views);
		console.timeEnd("render");
		if (target) {
			target.appendChild(el);
			this.mounted();
		}
		return el;
	}

	mounted() {
		for (let [view, el] of this.#ctx) {
			if (!view || !el || !view.mounted) continue;
			view.mounted(el);
		}
	}
}
