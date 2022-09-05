import DOMPurify from "dompurify";
import { escapeHTML } from "./util";

const PURIFY_OPTIONS: DOMPurify.Config = {
	RETURN_DOM_FRAGMENT: false,
	RETURN_DOM: false,
	FORCE_BODY: true,
	ADD_TAGS: ["iframe", "template", "style", "video"],
	ADD_ATTR: ["frameborder", "style"],
	CUSTOM_ELEMENT_HANDLING: {
		tagNameCheck: /^nd-shadowed-content$/,
	},
};

export interface RenderableElement {
	tag: string;
	attributes: Record<string, string | boolean>;
	children: (RenderableElement | RenderableNode | string | undefined)[];
}

export interface RenderableNode {
	raw: boolean;
	contents: string;
}

export function createRawNode(contents: string): RenderableNode {
	return {
		raw: true,
		contents: DOMPurify.sanitize(contents, PURIFY_OPTIONS) as string,
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
		else element.setAttribute(key, escapeHTML(value));
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

export function renderElementString(el: RenderableElement): string {
	let result = `<${el.tag} `;
	result += Object.entries(el.attributes)
		.map(([key, value]) => (typeof value === "boolean" ? `${value ? key : ""}` : `${key}="${escapeHTML(value)}"`))
		.join(" ");
	let children = el.children
		.map((child) => {
			if (!child) return "";
			if (typeof child === "string") {
				return escapeHTML(child);
			} else if ((child as RenderableNode).raw) {
				return (child as RenderableNode).contents;
			}
			return renderElementString(child as RenderableElement);
		})
		.join("");
	result += `>${children}</${el.tag}>`;

	let res = DOMPurify.sanitize(result, PURIFY_OPTIONS) as string;
	if (el.tag === "template") console.log("template, or not...", res, result);
	return res;
}

export function renderElement<T extends boolean, U extends T extends true ? string : HTMLElement>(
	el: RenderableElement,
	ssr: T
): U {
	if (ssr) return renderElementString(el) as unknown as U;
	return renderElementDOM(el) as unknown as U;
}

export function setStyles(el: RenderableElement, styles: Record<string, string>, original: string = "") {
	let resp =
		original +
		" " +
		Object.entries(styles)
			.map(([key, value]) => `${key}: ${value}`)
			.join(";");
	el.attributes["style"] = resp;
}

export function setClassList(el: RenderableElement, classList: (string | boolean | undefined)[]) {
	el.attributes["class"] = classList.filter(Boolean).join(" ");
}
