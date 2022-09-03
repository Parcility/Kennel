import type { DepictionBaseView } from ".";
import { guardIfNotType, RenderCtx } from "../util";

export default class DepictionSpacerView implements DepictionBaseView {
	spacing: number;
	ctx: RenderCtx;

	constructor(dictionary: any, ctx: RenderCtx) {
		this.ctx = ctx;
		this.spacing = guardIfNotType(dictionary["spacing"], "number");
	}

	render(): HTMLElement {
		const el = document.createElement("br");
		el.className = "nd-spacer";
		el.style.minHeight = `${this.spacing}px`;
		el.style.minWidth = `${this.spacing}px`;
		return el;
	}
}
