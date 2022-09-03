import type { DepictionBaseView } from ".";
import { guardIfNotType, KennelError, makeView, RenderCtx, renderView } from "../util";

export default class DepictionMinVersionForceView implements DepictionBaseView {
	ctx: RenderCtx;
	view: DepictionBaseView;

	constructor(dictionary: any, ctx: RenderCtx) {
		this.ctx = ctx;
		// TODO: actually check the version Kennel supports against this
		let view = guardIfNotType(dictionary["view"], "object");
		let madeView = makeView(view, ctx);
		if (!madeView) throw new KennelError("No view to render");
		this.view = madeView;
	}

	render(): Promise<HTMLElement> {
		return renderView(this.view, this.ctx);
	}
}
