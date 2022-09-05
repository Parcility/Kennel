/// <reference types="vite/client" />
import "./index.css";
import { createElement, renderElement, setStyles } from "./renderable";
import { constructView, constructViews, defaultIfNotType, KennelError, makeViews } from "./util";
import { DepictionBaseView, views } from "./views";

interface RenderOptions {
	ssr: boolean;
	defaultTintColor: string;
}

export async function render(depiction: any, options?: Partial<RenderOptions>): Promise<HTMLElement | string> {
	console.time("process");
	let tintColor = defaultIfNotType(depiction["tintColor"], "string", options?.defaultTintColor as string) as
		| string
		| undefined;
	let processed: DepictionBaseView[] | undefined;
	if (Array.isArray(depiction.tabs)) {
		depiction.className = "DepictionTabView";
		let view = constructView(depiction);
		if (view) {
			processed = [view];
		}
	} else if (Array.isArray(depiction.views)) {
		processed = constructViews(depiction.views);
	}
	console.timeEnd("process");
	if (!processed) throw new KennelError("Unable to process depiction. No child was found.");
	let el = createElement("div");
	if (tintColor) {
		setStyles(el, {
			"--kennel-tint-color": tintColor,
		});
	}
	el.children = await makeViews(processed);
	return renderElement(el, options?.ssr || false);
}

export async function hydrate(el?: ParentNode) {
	if (!("HTMLElement" in globalThis)) throw new Error("Can't mount, no DOM in this environment");
	if (!el) el = document;
	let mountableEls = el.querySelectorAll<HTMLElement>("[data-kennel-view]");

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
		if (!view || !view.hydrate) continue;
		view.hydrate(el);
	}
}
