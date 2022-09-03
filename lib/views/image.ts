import type { DepictionBaseView } from ".";
import { defaultIfNotType, guardIfNotType, KennelError, makeViews, RenderCtx, renderViews } from "../util";

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
		this.url = guardIfNotType(dictionary["URL"], "string");
		this.width = defaultIfNotType(dictionary["width"], "number", 0);
		this.height = defaultIfNotType(dictionary["height"], "number", 0);

		if (this.width === 0 || this.height === 0) throw new KennelError("Invalid image size");

		this.borderRadius = guardIfNotType(dictionary["cornerRadius"], "number");
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
