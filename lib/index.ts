/// <reference types="vite/client" />
import "./index.css";
import { createElement, renderElement } from "./renderable";
import { constructView, constructViews, makeViews, undefIfNotType } from "./util";
import { DepictionBaseView, views } from "./views";

export default class Kennel {
	#depiction: any;
	#processed: DepictionBaseView[] = [];
	#tintColor?: string;

	constructor(depiction: any) {
		this.#depiction = depiction;
		console.time("process");
		this.#tintColor = undefIfNotType(depiction["tintColor"], "string");
		if (Array.isArray(this.#depiction.tabs)) {
			this.#depiction.className = "DepictionTabView";
			let view = constructView(this.#depiction);
			if (!view) return;
			this.#processed = [view];
		} else if (Array.isArray(this.#depiction.views)) {
			this.#processed = constructViews(this.#depiction.views);
		}
		console.timeEnd("process");
	}

	async render(ssr: boolean = false): Promise<HTMLElement | string> {
		let el = createElement("div", { style: `--kennel-tint-color: ${this.#tintColor};` });
		el.children = await makeViews(this.#processed);
		return renderElement(el, ssr);
	}

	mounted() {
		if (!("HTMLElement" in globalThis)) return;
		let mountableEls = document.querySelectorAll<HTMLElement>("[data-kennel-view]");

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

		for (let i = 0, len = mountableEls.length; i < len; i++) {
			let el = mountableEls[i];
			let viewName = el.dataset.kennelView;
			console.log(viewName);
			if (typeof viewName !== "string") continue;
			let view = views.get(viewName);
			console.log(view, view?.prototype);
			if (!view || !view.prototype.mounted) continue;
			view.prototype.mounted(el);
		}
	}
}
