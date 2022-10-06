/// <reference types="vite/client" />
import "./index.scss";
import { RenderOptions, createElement, renderElement, setStyles } from "./renderable";
import { constructView, constructViews, defaultIfNotType, undefIfNotType, KennelError, makeViews } from "./util";
import { DepictionBaseView, mountable } from "./views";

export async function render<T extends Partial<RenderOptions>, U extends T["ssr"] extends true ? string : HTMLElement>(
	depiction: any,
	options?: T
): Promise<U> {
	let tintColor = defaultIfNotType(depiction["tintColor"], "color", options?.defaultTintColor as string) as
		| string
		| undefined;
	let backgroundColor = undefIfNotType(depiction["backgroundColor"], "color") as
		| string
		| undefined;

	// process the depiction
	let processed: DepictionBaseView[] | undefined;
	if (Array.isArray(depiction.tabs)) {
		depiction.className = "DepictionTabView";
		let view = constructView(depiction, options);
		if (view) {
			processed = [view];
		}
	} else if (Array.isArray(depiction.views)) {
		processed = constructViews(depiction.views, options);
	}
	if (!processed) throw new KennelError("Unable to process depiction. No child was found.");

	// build an element to render
	let el = createElement("form", { class: "nd-root" });
	let styleOptions: any = {};
	if (tintColor) {
		styleOptions["--kennel-tint-color"] = tintColor;
	}
	if (backgroundColor) {
		styleOptions["background-color"] = backgroundColor;
	}
	if (Object.keys(styleOptions).length > 0) {
		setStyles(el, styleOptions);
	}
	el.children = await makeViews(processed);

	// return rendered element
	return renderElement(el, options?.ssr || false) as unknown as U;
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
		if (typeof viewName !== "string") continue;
		let view = mountable.get(viewName);
		if (!view || !view.hydrate) continue;
		view.hydrate(el);
	}
}
