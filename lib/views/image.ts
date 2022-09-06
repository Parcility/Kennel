import { createElement, RenderableElement, setStyles } from "../renderable";
import { Alignment, applyAlignmentMargin, defaultIfNotType, getAlignment, guardIfNotType, KennelError } from "../util";
import DepictionBaseView from "./base";

export default class DepictionImageView extends DepictionBaseView {
	alignment: Alignment;
	url: string;
	width: number;
	height: number;
	xPadding: number;
	borderRadius: number;
	static viewName = "DepictionImageView";

	constructor(dictionary: any) {
		super(dictionary);
		this.url = guardIfNotType(dictionary["URL"], "string");
		this.width = defaultIfNotType(dictionary["width"], "number", 0);
		this.height = defaultIfNotType(dictionary["height"], "number", 0);

		if (this.width === 0 || this.height === 0) throw new KennelError("Invalid image size");

		this.borderRadius = guardIfNotType(dictionary["cornerRadius"], "number");
		this.alignment = getAlignment(defaultIfNotType(dictionary["alignment"], "number", 0));
		this.xPadding = defaultIfNotType(dictionary["xPadding"], "number", 0);
	}

	async make(): Promise<RenderableElement> {
		const el = createElement("img", { class: "nd-image", src: this.url, loading: "lazy" });
		setStyles(el, {
			width: `${this.width}px`,
			height: `${this.height}px`,
			"border-radius": `${this.borderRadius}px`,
			"object-fit": "cover",
			padding: `0 ${this.xPadding}px`,
		});
		applyAlignmentMargin(el, this.alignment);
		return el;
	}
}
