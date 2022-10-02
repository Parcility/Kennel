import { createElement } from "../renderable";
import { Alignment, applyAlignmentMargin, defaultIfNotType, getAlignment, guardIfNotType } from "../util";
import DepictionBaseView from "./base";

export default class DepictionWebView extends DepictionBaseView {
	url: string;
	width: number;
	height: number;
	alignment: Alignment;
	static viewName = "DepictionWebView";

	constructor(dictionary: any) {
		super(dictionary);
		this.url = guardIfNotType(dictionary["URL"], "url");
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
			frameborder: "0",
		});
		applyAlignmentMargin(el, this.alignment);
		return el;
	}
}
