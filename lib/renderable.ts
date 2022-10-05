import createDOMPurify, { DOMPurifyI } from "dompurify";
import { escapeHTML } from "./util";

export interface RenderOptions {
	ssr: boolean;
	defaultTintColor: string;
	backgroundColor: string;
	ignoredViewNames: any[];
	linkForm: string;
	linkHeaderless: string;
	proxyUrl: string;
	proxyIframeUrl: string;
	proxyImageUrl: string;
	proxyVideoUrl: string;
}

const PURIFY_OPTIONS: createDOMPurify.Config = {
	RETURN_DOM_FRAGMENT: false,
	RETURN_DOM: false,
	FORCE_BODY: true,
	ADD_TAGS: ["iframe", "template", "style", "video"],
	ADD_ATTR: ["frameborder", "style"],
	CUSTOM_ELEMENT_HANDLING: {
		tagNameCheck: /^nd-shadowed-content$/,
	},
};

let DOMPurify: Promise<DOMPurifyI> = (async function () {
	if (!("window" in globalThis)) {
		const { JSDOM } = await import("jsdom");
		const window = new JSDOM("").window;
		return createDOMPurify(window as any);
	}
	return createDOMPurify;
})();

export interface RenderableElement {
	tag: string;
	attributes: Record<string, string | boolean>;
	children: (RenderableElement | RenderableNode | string | undefined)[];
}

export interface RenderableNode {
	raw: boolean;
	contents: string;
}

export async function createRawNode(contents: string): Promise<RenderableNode> {
	return {
		raw: true,
		contents: (await DOMPurify).sanitize(contents, PURIFY_OPTIONS) as string,
	};
}

export function createElement(
	tag: RenderableElement["tag"],
	attributes?: RenderableElement["attributes"],
	children?: RenderableElement["children"]
): RenderableElement {
	return { tag, attributes: attributes ?? {}, children: children ?? [] };
}

export function createShadowedElement(
	attributes: RenderableElement["attributes"],
	children: RenderableElement["children"]
): RenderableElement {
	return createElement("nd-shadowed-content", attributes, [createElement("template", {}, children)]);
}

export function renderElementDOM(el: RenderableElement): HTMLElement {
	const element = document.createElement(el.tag);
	for (const [key, value] of Object.entries(el.attributes)) {
		if (typeof value === "boolean") element.toggleAttribute(key, value);
		else element.setAttribute(key, escapeHTML(value, true));
	}
	for (const child of el.children) {
		let target = el.tag === "template" ? (element as HTMLTemplateElement).content : element;
		if (child === undefined) continue;
		if (typeof child === "string") {
			target.appendChild(document.createTextNode(child));
		} else if ((child as RenderableNode).raw) {
			let el = document.createElement("div");
			el.innerHTML = (child as RenderableNode).contents;
			target.append.apply(target, Array.from(el.children));
		} else {
			target.appendChild(renderElementDOM(child as RenderableElement));
		}
	}
	return element;
}

export async function renderElementString(el: RenderableElement): Promise<string> {
	let result = `<${el.tag} `;
	result += Object.entries(el.attributes)
		.map(([key, value]) =>
			typeof value === "boolean" ? `${value ? key : ""}` : `${key}="${escapeHTML(value, true)}"`
		)
		.join(" ");
	let children = await Promise.all(
		el.children.map(async (child) => {
			if (!child) return "";
			if (typeof child === "string") {
				return escapeHTML(child);
			} else if ((child as RenderableNode).raw) {
				return (child as RenderableNode).contents;
			}
			return renderElementString(child as RenderableElement);
		})
	);
	result += `>${children.join("")}</${el.tag}>`;

	let res = (await DOMPurify).sanitize(result, PURIFY_OPTIONS) as string;
	return res;
}

export function renderElement<T extends boolean, U extends T extends true ? string : HTMLElement>(
	el: RenderableElement,
	ssr: T
): Promise<U> {
	if (ssr) return renderElementString(el) as unknown as Promise<U>;
	return Promise.resolve(renderElementDOM(el) as unknown as U);
}

export function setStyles(el: RenderableElement, styles: Record<string, string>, original: string = "") {
	let resp = [original, Object.entries(styles).map(([key, value]) => `${key}: ${value}`)]
		.filter(Boolean)
		.flat()
		.join(";");
	el.attributes["style"] = resp;
}

export function setClassList(el: RenderableElement, classList: (string | boolean | undefined)[]) {
	el.attributes["class"] = classList.filter(Boolean).join(" ");
}
