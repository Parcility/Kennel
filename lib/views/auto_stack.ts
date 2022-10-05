import { RenderOptions, createElement, RenderableElement, setStyles } from "../renderable";
import { constructView, guardIfNotType, makeViews, undefIfNotType } from "../util";
import DepictionBaseView from "./base";

export default class DepictionAutoStackView extends DepictionBaseView {
	views: DepictionBaseView[] = [];
	viewWidths: number[];
	horizontalSpacing: number;
	backgroundColor?: string;
	static viewName = "DepictionAutoStackView";

	constructor(
		depiction: any,
		options?: Partial<RenderOptions>
	) {
		super(depiction, options);

		let views = guardIfNotType(depiction["views"], "array");
		this.horizontalSpacing = guardIfNotType(depiction["horizontalSpacing"], "number");
		for (let view of views) {
			guardIfNotType(view["class"], "string");
			guardIfNotType(view["preferredWidth"], "number");
			let v = constructView(view, options);
			if (!v) throw new Error("Invalid view");
			this.views.push(v);
		}

		this.viewWidths = views.map((view) => view["preferredWidth"] as number);
		this.backgroundColor = undefIfNotType(depiction["backgroundColor"], "color");
	}

	async make(): Promise<RenderableElement> {
		let children = await makeViews(this.views);
		let el = createElement("div", { class: "nd-auto-stack" }, children);
		let styles: any = {
			"grid-template-columns": this.viewWidths.map((v) => v + "px").join(" "),
			"column-gap": this.horizontalSpacing,
		};
		if (this.backgroundColor) styles["background-color"] = this.backgroundColor;
		setStyles(el, styles);
		return el;
	}
}
