import type { DepictionBaseView } from ".";
import { fontWeightParse, parseSize, RenderCtx, textAlignment } from "./_util";

export default class DepictionLabelView implements DepictionBaseView {
	text: string;
	margins = { left: 0, right: 0, top: 0, bottom: 0 };
	useDefaultColor: boolean;
	textColor?: string;
	weight: string;
	alignment: string;
	isActionable: any;
	isHighlighted: any;
	ctx: RenderCtx;

	constructor(dictionary: any, ctx: RenderCtx) {
		this.ctx = ctx;
		if (typeof dictionary["text"] === "string") {
			this.text = dictionary.text;
		}

		let rawMargins = dictionary["margins"];
		if (typeof rawMargins === "string") {
			let [top, left, bottom, right] = parseSize(rawMargins);
			this.margins = { left, right, top, bottom };
		}

		if (this.margins.left === 0) {
			this.margins.left = 16;
		}
		if (this.margins.right === 0) {
			this.margins.right = 16;
		}

		let useMargins = dictionary["useMargins"] ?? true;
		let usePadding = dictionary["usePadding"] ?? true;

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

		this.useDefaultColor = true;
		let rawTextColor = dictionary["textColor"];
		if (typeof rawTextColor === "string") {
			this.textColor = rawTextColor;
			this.useDefaultColor = false;
		}

		this.weight = fontWeightParse(fontWeight);
		this.alignment = textAlignment(dictionary["alignment"]);
	}

	render(): HTMLElement {
		const el = document.createElement("p");
		el.className = "nd-label";
		el.innerText = this.text;
		el.style.textAlign = this.alignment;
		el.style.fontWeight = this.weight;
		el.style.marginTop = this.margins.top + "px";
		el.style.marginRight = this.margins.right + "px";
		el.style.marginLeft = this.margins.left + "px";
		el.style.marginBottom = this.margins.bottom + "px";
		if (this.useDefaultColor) {
			if (this.isActionable) {
				if (this.isHighlighted) {
					el.style.filter = "saturation(75%)";
				} else if (this.textColor) {
					el.style.color = this.textColor;
				}
			}
		}
		return el;
	}
}
