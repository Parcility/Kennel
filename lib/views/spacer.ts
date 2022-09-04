import { createElement, setStyles } from "../renderable";
import { guardIfNotType, RenderCtx } from "../util";
import DepictionBaseView from "./base";

export default class DepictionSpacerView extends DepictionBaseView {
	spacing: number;

	constructor(dictionary: any, ctx: RenderCtx) {
		super(dictionary, ctx);
		this.spacing = guardIfNotType(dictionary["spacing"], "number");
	}

	async make() {
		const el = createElement("br", { class: "nd-spacer" });
		setStyles(el, {
			"min-height": `${this.spacing}px`,
			"min-width": `${this.spacing}px`,
		});
		return el;
	}
}
