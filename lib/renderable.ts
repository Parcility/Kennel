import DOMPurify from "dompurify";

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
		contents: DOMPurify.sanitize(contents),
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
		else element.setAttribute(key, value);
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
		.map(([key, value]) => (typeof value === "boolean" ? `${value ? key : ""}` : `${key}="${value}"`))
		.join(" ");
	result += `>${el.children
		.map((child) => {
			if (!child) return "";
			if (typeof child === "string") {
				return child;
			} else if ((child as RenderableNode).raw) {
				return (child as RenderableNode).contents;
			}
			return renderElementString(child as RenderableElement);
		})
		.join("")}</${el.tag}>`;
	return DOMPurify.sanitize(result);
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
