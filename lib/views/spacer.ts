import type { DepictionBaseView } from ".";
import { RenderCtx } from "./_util";

export default class DepictionSpacerView implements DepictionBaseView {
	spacing: number;
	ctx: RenderCtx;

	constructor(dictionary: any, ctx: RenderCtx) {
		this.ctx = ctx;
		let spacing = dictionary["spacing"];
		if (typeof spacing !== "number") {
			return;
		}
		this.spacing = spacing;
	}

	render(): HTMLElement {
		const el = document.createElement("br");
		el.className = "nd-spacer";
		el.style.minHeight = `${this.spacing}px`;
		el.style.minWidth = `${this.spacing}px`;
		return el;
	}
}
