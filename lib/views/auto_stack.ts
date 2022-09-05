import { createElement, RenderableElement } from "../renderable";
import { guardIfNotType, makeView, RenderCtx, undefIfNotType } from "../util";
import DepictionBaseView from "./base";

export default class DepictionAutoStackView extends DepictionBaseView {
	views: DepictionBaseView[] = [];
	viewWidths: number[];
	horizontalSpacing: number;
	backgroundColor?: string;

	constructor(depiction: any, ctx: RenderCtx) {
		super(depiction, ctx);

		let views = guardIfNotType(depiction["views"], "array");
		this.horizontalSpacing = guardIfNotType(depiction["horizontalSpacing"], "number");
		for (let view of views) {
			guardIfNotType(view["class"], "string");
			guardIfNotType(view["preferredWidth"], "number");
			let v = makeView(view, ctx);
			if (!v) throw new Error("Invalid view");
			this.views.push(v);
		}

		this.viewWidths = views.map((view) => view["preferredWidth"] as number);
		this.backgroundColor = undefIfNotType(depiction["backgroundColor"], "string");
	}

	async make(): Promise<RenderableElement> {
		let children = await Promise.all(this.views.map(async (view) => view.make()));
		let el = createElement(
			"div",
			{
				class: "nd-auto-stack",
				styles: `grid-template-columns: ${this.viewWidths.map((v) => v + "px").join(" ")}; column-gap: ${
					this.horizontalSpacing
				};`,
			},
			children
		);
		return el;
	}
}
