import { createElement, RenderableElement, setStyles } from "../renderable";
import { defaultIfNotType, fontWeightParse, parseSize, textAlignment, undefIfNotType } from "../util";
import DepictionBaseView from "./base";

export default class DepictionLabelView extends DepictionBaseView {
	text?: string;
	margins = { left: 0, right: 0, top: 0, bottom: 0 };
	textColor?: string;
	weight: string;
	alignment: string;
	isActionable: any;
	isHighlighted: any;
	fontSize: number;
	static viewName = "DepictionLabelView";

	constructor(dictionary: any) {
		super(dictionary);
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

		let fontWeight = defaultIfNotType(dictionary["fontWeight"], "string", "normal");

		this.fontSize = defaultIfNotType(dictionary["fontSize"], "number", 14);

		this.textColor = undefIfNotType(dictionary["textColor"], "color");

		this.weight = fontWeightParse(fontWeight);
		this.alignment = textAlignment(dictionary["alignment"]);
	}

	async make(): Promise<RenderableElement> {
		const el = createElement("p", { class: "nd-label" }, [this.text]);
		let styles: Record<string, string> = {
			"text-align": this.alignment,
			"font-weight": this.weight,
			"font-size": `${this.fontSize}px`,
			"margin-top": this.margins.top + "px",
			"margin-right": this.margins.right + "px",
			"margin-left": this.margins.left + "px",
			"margin-bottom": this.margins.bottom + "px",
		};
		if (this.textColor) styles.color = this.textColor;
		if (this.tintColor) styles["--kennel-tint-color"] = this.tintColor;
		if (!this.textColor) {
			if (this.isActionable) {
				if (this.isHighlighted) {
					styles.filter = "saturation(75%)";
				} else {
					styles.color = "var(--kennel-tint-color)";
				}
			}
		}
		setStyles(el, styles);
		return el;
	}
}
