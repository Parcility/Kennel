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
		// min-height & min-width doesn't seems to be applied on <br> using Firefox for macOS.
		setStyles(el, {
			"margin": `${(this.spacing / 2)}px`
		});
		return el;
	}
}
