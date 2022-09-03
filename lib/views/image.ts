import type { DepictionBaseView } from ".";
import { defaultIfNotType, makeViews, RenderCtx, renderViews } from "./_util";

export default class DepictionLayerView implements DepictionBaseView {
	alignment: number;
	url: string;
	width: number;
	height: number;
	xPadding: number;
	borderRadius: number;
	ctx: RenderCtx;

	constructor(dictionary: any, ctx: RenderCtx) {
		this.ctx = ctx;
		let url = dictionary["URL"];
		if (typeof url !== "string") return;
		this.url = url;

		this.width = defaultIfNotType(dictionary["width"], "number", 0);
		this.height = defaultIfNotType(dictionary["height"], "number", 0);
		if (this.width === 0 || this.height === 0) {
			return;
		}

		let radius = dictionary["cornerRadius"];
		if (typeof radius !== "number") return;
		this.borderRadius = radius;

		this.alignment = defaultIfNotType(dictionary["alignment"], "number", 0);
		this.xPadding = defaultIfNotType(dictionary["xPadding"], "number", 0);
	}

	async render(): Promise<HTMLElement> {
		const el = document.createElement("img");
		el.className = "nd-image";
		el.src = this.url;
		el.style.width = `${this.width}px`;
		el.style.height = `${this.height}px`;
		el.style.borderRadius = `${this.borderRadius}px`;
		el.style.padding = `0 ${this.xPadding}px`;
		el.loading = "lazy";
		return el;
	}
}
