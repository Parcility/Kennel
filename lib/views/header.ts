import type { DepictionBaseView } from ".";
import { defaultIfNotType, RenderCtx, textAlignment } from "../util";

export default class DepictionHeaderView implements DepictionBaseView {
	title: string;
	useMargins: boolean;
	useBottomMargin: boolean;
	bold: boolean;
	textColor?: string;
	alignment: string;
	ctx: RenderCtx;

	constructor(dictionary: any, ctx: RenderCtx) {
		this.ctx = ctx;
		if (typeof dictionary["title"] === "string") {
			this.title = dictionary.title;
		}
		this.useMargins = defaultIfNotType(dictionary["useMargins"], "boolean", true);
		this.useBottomMargin = defaultIfNotType(dictionary["useBottomMargin"], "boolean", true);
		this.bold = defaultIfNotType(dictionary["useBoldText"], "boolean", false);
		if (!this.bold) {
			this.textColor = "rgb(175, 175, 175)";
		}

		this.alignment = textAlignment(dictionary["alignment"]);
	}

	render(): HTMLElement {
		const el = document.createElement("p");
		el.className = "nd-header";
		el.innerText = this.title;
		el.style.textAlign = this.alignment;
		el.style.fontWeight = this.bold ? "bold" : "normal";
		if (this.textColor) el.style.color = this.textColor;
		if (!this.useMargins) {
			el.style.height = "26px";
		} else if (!this.useBottomMargin) {
			el.style.height = "34px";
		} else {
			el.style.height = "42px";
		}
		return el;
	}
}
