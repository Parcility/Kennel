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
	var weight: string;
	switch (fontWeight) {
		case "black":
			weight = "900";
		case "bold":
			weight = "700";
		case "heavy":
			weight = "800";
		case "light":
			weight = "400";
		case "medium":
			weight = "500";
		case "semibold":
			weight = "600";
		case "thin":
			weight = "300";
		case "ultralight":
			weight = "200";
		default:
			weight = "regular";
	}
	return weight;
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

// Processing

export function makeView(view: any, ctx: RenderCtx): DepictionBaseView | undefined {
	let v = views.get(view.class);
	try {
		if (v) return new v(view, ctx);
	} catch (error) {
		console.error(error);
	}
}

export function makeViews(views: any[], ctx: RenderCtx): DepictionBaseView[] {
	return views.map((view) => makeView(view, ctx)).filter(Boolean) as DepictionBaseView[];
}

// Rendering

export type RenderCtx = Map<DepictionBaseView, HTMLElement | undefined>;

export async function renderView(view: DepictionBaseView, ctx: RenderCtx): Promise<HTMLElement> {
	let el = await view.render();
	if (view.htmlID) el.id = view.htmlID;
	ctx.set(view, el);
	return el;
}

export function renderViews(views: DepictionBaseView[], ctx: RenderCtx): Promise<HTMLElement[]> {
	return Promise.all(views.map((view) => renderView(view, ctx)));
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
