import "./index.css";
import { createElement, renderElement } from "./renderable";
import { makeView, makeViews, RenderCtx } from "./util";
import type { DepictionBaseView } from "./views";

export default class Kennel {
	#depiction: any;
	#processed: DepictionBaseView[] = [];
	#ctx: RenderCtx;

	constructor(depiction: any, ssr = false) {
		this.#ctx = { ssr, els: new Map() };
		this.#depiction = depiction;
		console.time("process");
		if (Array.isArray(this.#depiction.tabs)) {
			this.#depiction.className = "DepictionTabView";
			let view = makeView(this.#depiction, this.#ctx);
			if (!view) return;
			this.#processed = [view];
		} else if (Array.isArray(this.#depiction.views)) {
			this.#processed = makeViews(this.#depiction.views, this.#ctx);
		}
		console.timeEnd("process");
	}

	async render(): Promise<HTMLElement | string> {
		let el = createElement("div");
		el.children = await Promise.all(this.#processed.map((view) => view.make()));
		return renderElement(el, this.#ctx);
	}

	mounted() {
		if (this.#ctx.ssr) return;

		self.customElements.define(
			"nd-shadowed-content",
			class ShadowedElement extends HTMLElement {
				constructor() {
					super();
					let tmpl = this.querySelector("template");
					if (!tmpl) return;
					let content = tmpl.content.cloneNode(true);
					let shadow = this.attachShadow({ mode: "open" });
					shadow.appendChild(content);
				}
			}
		);

		for (let [view, el] of this.#ctx.els) {
			if (!view || !el || !view.mounted) continue;
			view.mounted(el);
		}
	}
}
