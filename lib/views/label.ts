import { createElement, RenderableElement, setStyles } from "../renderable";
import { defaultIfNotType, fontWeightParse, parseSize, RenderCtx, textAlignment } from "../util";
import DepictionBaseView from "./base";

export default class DepictionLabelView extends DepictionBaseView {
	text: string;
	margins = { left: 0, right: 0, top: 0, bottom: 0 };
	textColor?: string;
	weight: string;
	alignment: string;
	isActionable: any;
	isHighlighted: any;
	ctx: RenderCtx;

	constructor(dictionary: any, ctx: RenderCtx) {
		super(dictionary, ctx);
		if (typeof dictionary["text"] === "string") {
			this.text = dictionary.text;
		}

		let rawMargins = dictionary["margins"];
		if (typeof rawMargins === "string") {
			let [top, left, bottom, right] = parseSize(rawMargins);
			this.margins = { left, right, top, bottom };
		}

		if (this.margins.left === 0) this.margins.left = 16;
		if (this.margins.right === 0) this.margins.right = 16;

		let useMargins = defaultIfNotType(dictionary["useMargins"], "boolean", true);
		let usePadding = defaultIfNotType(dictionary["usePadding"], "boolean", true);

		if (!useMargins) {
			this.margins = { left: 0, right: 0, top: 0, bottom: 0 };
		} else if (!usePadding) {
			this.margins.top = 0;
			this.margins.bottom = 0;
		}

		var fontWeight = "normal";
		let rawFontWeight = dictionary["fontWeight"];
		if (typeof rawFontWeight === "string") {
			fontWeight = rawFontWeight.toLowerCase();
		}
		let fontSize = dictionary["fontSize"];
		if (typeof fontSize !== "number") fontSize = 14;

		let rawTextColor = dictionary["textColor"];
		if (typeof rawTextColor === "string") {
			this.textColor = rawTextColor;
		}

		this.weight = fontWeightParse(fontWeight);
		this.alignment = textAlignment(dictionary["alignment"]);
	}

	async make(): Promise<RenderableElement> {
		const el = createElement("p", { class: "nd-label" }, [this.text]);
		let styles: Record<string, string> = {
			"text-align": this.alignment,
			"font-weight": this.weight,
			"margin-top": this.margins.top + "px",
			"margin-right": this.margins.right + "px",
			"margin-left": this.margins.left + "px",
			"margin-bottom": this.margins.bottom + "px",
		};
		if (this.textColor) styles.color = this.textColor;
		if (!this.textColor) {
			if (this.isActionable) {
				if (this.isHighlighted) {
					styles.filter = "saturation(75%)";
				}
			}
		}
		setStyles(el, styles);
		return el;
	}
}
