import { RenderableElement, setStyles } from "./renderable";
import { DepictionBaseView, views } from "./views";

export class KennelError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "KennelError";
	}
}

export function parseSize(str: string): number[] {
	let trimmed = str.replace("{", "").replace("}", "");
	return trimmed
		.split(",")
		.filter(Boolean)
		.map((s) => parseFloat(s.trim()));
}

export function fontWeightParse(fontWeight: string): string {
	switch (fontWeight) {
		case "black":
			return "900";
		case "bold":
			return "700";
		case "heavy":
			return "800";
		case "light":
			return "400";
		case "medium":
			return "500";
		case "semibold":
			return "600";
		case "thin":
			return "300";
		case "ultralight":
			return "200";
		default:
			return "regular";
	}
}

// Alignment

export enum Alignment {
	Left,
	Center,
	Right,
}

export function getAlignment(value: any): Alignment {
	switch (value) {
		case 1:
			return Alignment.Center;
		case 2:
			return Alignment.Right;
		default:
			return Alignment.Left;
	}
}

export function textAlignment(value: any): string {
	switch (value) {
		case 1:
			return "center";
		case 2:
			return "right";
		default:
			return "left";
	}
}

export function applyAlignmentMargin(el: RenderableElement, alignment: Alignment) {
	let styles;
	switch (alignment) {
		case Alignment.Left:
			styles = { "margin-right": "auto" };
			break;
		case Alignment.Right:
			styles = { "margin-left": "auto" };
			break;
		case Alignment.Center:
			styles = { "margin-left": "auto", "margin-right": "auto" };
			break;
	}
	setStyles(el, styles, typeof el.attributes.style === "boolean" ? "" : el.attributes.style || "");
}

// Processing

export function constructView(view: any): DepictionBaseView | undefined {
	let v = views.get(view.class);
	try {
		if (v) return new v(view);
	} catch (error) {
		console.error(error);
	}
	return undefined;
}

export function constructViews(views: any[]): DepictionBaseView[] {
	return views.map(constructView).filter(Boolean) as DepictionBaseView[];
}

export async function makeView(view: DepictionBaseView): Promise<RenderableElement> {
	let madeView = await view.make();
	if (view.mounted) madeView.attributes["data-kennel-view"] = view.constructor.name;
	return madeView;
}

export function makeViews(views: DepictionBaseView[]): Promise<RenderableElement[]> {
	return Promise.all(views.map(async (view) => makeView(view)));
}

// Type handling & validation

export interface JSTypes {
	undefined: undefined;
	object: null | ArrayLike<any> | Record<string | number | symbol, any>;
	array: any[];
	boolean: boolean;
	number: number;
	bigint: bigint;
	string: string;
	symbol: symbol;
	function: Function;
}

export function isType<T extends keyof JSTypes>(value: any, type: T): boolean {
	return (type === "array" && Array.isArray(value)) || typeof value === type;
}

export function undefIfNotType<T extends keyof JSTypes, U extends JSTypes[T]>(value: any, type: T): U | undefined {
	if (isType(value, type)) return value;
	return undefined;
}

export function defaultIfNotType<T extends keyof JSTypes, U extends JSTypes[T]>(
	value: any,
	type: T,
	defaultValue: U
): U {
	if (isType(value, type)) return value;
	return defaultValue;
}

export function guardIfNotType<T extends keyof JSTypes, U extends JSTypes[T]>(value: any, type: T): U {
	if (!isType(value, type)) throw new KennelError(`Expected type ${type} but got ${typeof value}`);
	return value;
}

export function buttonLinkHandler(url: string, label?: string) {
	// javascript: links should do nothing.
	const jsXssIndex = url.indexOf("javascript:");
	if (jsXssIndex !== -1) {
		return url.substring(0, jsXssIndex) + encodeURIComponent(url.substring(jsXssIndex));
		// depiction- links should link to a depiction. Use Parcility's API for this.
	} else if (url.indexOf("depiction-") == 0) {
		url = url.substring(10);
		if (!label) label = "Depiction";
		return `https://api.parcility.co/render/headerless?url=${encodeURIComponent(url)}&name=${label}`;
	} else if (url.indexOf("form-") == 0) {
		url = url.substring(5);
		return `https://api.parcility.co/render/form?url=${encodeURIComponent(url)}`;
	} else {
		return url;
	}
}
