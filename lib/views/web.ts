import type { DepictionBaseView } from ".";
import { guardIfNotType, RenderCtx } from "../util";

export default class DepictionSeparatorView implements DepictionBaseView {
	url: string;
	width: number;
	height: number;
	ctx: RenderCtx;

	constructor(dictionary: any, ctx: RenderCtx) {
		this.ctx = ctx;
		this.url = guardIfNotType(dictionary["URL"], "string");
		this.width = guardIfNotType(dictionary["width"], "number");
		this.height = guardIfNotType(dictionary["height"], "number");
	}

	render(): HTMLElement {
		const el = document.createElement("iframe");
		el.className = "nd-webview";
		el.src = this.url;
		el.width = this.width.toString();
		el.height = this.height.toString();
		return el;
	}
}
