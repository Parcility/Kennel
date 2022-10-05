import { RenderOptions, createElement, setStyles } from "../renderable";
import { guardIfNotType } from "../util";
import DepictionBaseView from "./base";

export default class DepictionSpacerView extends DepictionBaseView {
	spacing: number;
	static viewName = "DepictionSpacerView";

	constructor(
		dictionary: any,
		options?: Partial<RenderOptions>
	) {
		super(dictionary, options);
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
