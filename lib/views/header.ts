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
		this.bold = defaultIfNotType(dictionary["useBoldText"], "boolean", true);
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
		if (this.textColor) el.style.color = this.textColor;
		if (this.bold) el.classList.add("nd-bold");
		if (this.useMargins) el.classList.add("nd-using-margins");
		if (this.useBottomMargin) el.classList.add("nd-using-bottom-margin");
		return el;
	}
}
