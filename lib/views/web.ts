import type { DepictionBaseView } from ".";
import { RenderCtx } from "./_util";

export default class DepictionSeparatorView implements DepictionBaseView {
	url: string;
	width: number;
	height: number;
	ctx: RenderCtx;

	constructor(dictionary: any, ctx: RenderCtx) {
		this.ctx = ctx;
		let urlStr = dictionary["URL"];
		if (typeof urlStr !== "string") {
			throw new Error("invalid element");
		}
		this.url = urlStr;

		let width = dictionary["width"];
		if (typeof width !== "number") {
			throw new Error("invalid element");
		}
		this.width = width;

		let height = dictionary["height"];
		if (typeof height !== "number") {
			throw new Error("invalid element");
		}
		this.height = height;
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
