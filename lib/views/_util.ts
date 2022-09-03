import { DepictionBaseView, views } from ".";

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

export function makeView(view: any, ctx: RenderCtx): DepictionBaseView | undefined {
	let v = views.get(view.class);
	if (v) return new v(view, ctx);
	console.log(view);
}

export function makeViews(views: any[], ctx: RenderCtx): DepictionBaseView[] {
	return views.map((view) => makeView(view, ctx)).filter(Boolean) as DepictionBaseView[];
}

export type RenderCtx = Map<DepictionBaseView, HTMLElement | undefined>;

export async function renderView(view: DepictionBaseView, ctx: RenderCtx): Promise<HTMLElement> {
	let el = await view.render();
	ctx.set(view, el);
	return el;
}

export function renderViews(views: DepictionBaseView[], ctx: RenderCtx): Promise<HTMLElement[]> {
	return Promise.all(views.map((view) => renderView(view, ctx)));
}

export function defaultIfNotType<T = undefined>(value: any, type: string, defaultValue: T): T {
	if (typeof value === type) return value;
	return defaultValue;
}
