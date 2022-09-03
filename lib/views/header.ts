import type { DepictionBaseView } from ".";
import { RenderCtx, textAlignment } from "./_util";

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
		this.useMargins = dictionary["useMargins"] ?? true;
		this.useBottomMargin = dictionary["useBottomMargin"] ?? true;
		let useBoldText = dictionary["useBoldText"] ?? true;
		this.bold = useBoldText;
		if (!useBoldText) {
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
