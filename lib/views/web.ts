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
			return;
		}
		this.url = urlStr;

		let width = dictionary["width"];
		if (typeof urlStr !== "number") {
			return;
		}
		this.width = width;

		let height = dictionary["height"];
		if (typeof urlStr !== "number") {
			return;
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
