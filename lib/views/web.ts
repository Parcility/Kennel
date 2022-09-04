import { createElement } from "../renderable";
import { Alignment, applyAlignmentMargin, defaultIfNotType, getAlignment, guardIfNotType, RenderCtx } from "../util";
import DepictionBaseView from "./base";

export default class DepictionSeparatorView extends DepictionBaseView {
	url: string;
	width: number;
	height: number;
	alignment: Alignment;

	constructor(dictionary: any, ctx: RenderCtx) {
		super(dictionary, ctx);
		this.url = guardIfNotType(dictionary["URL"], "string");
		this.width = guardIfNotType(dictionary["width"], "number");
		this.height = guardIfNotType(dictionary["height"], "number");
		this.alignment = getAlignment(defaultIfNotType(dictionary["alignment"], "number", 0));
	}

	async make() {
		const el = createElement("iframe", {
			class: "nd-webview",
			src: this.url,
			width: `${this.width}px`,
			height: `${this.height}px`,
		});
		applyAlignmentMargin(el, this.alignment);
		return el;
	}
}
