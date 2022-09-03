import type { DepictionBaseView } from ".";
import { RenderCtx } from "./_util";

export default class DepictionSeparatorView implements DepictionBaseView {
	ctx: RenderCtx;
	constructor(_: any, ctx: RenderCtx) {
		this.ctx = ctx;
	}

	render(): HTMLElement {
		const el = document.createElement("hr");
		el.className = "nd-separator";
		return el;
	}
}
