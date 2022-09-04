import { guardIfNotType, KennelError, makeView, RenderCtx, renderView } from "../util";
import DepictionBaseView from "./base";

export default class DepictionMinVersionForceView extends DepictionBaseView {
	view: DepictionBaseView;

	constructor(dictionary: any, ctx: RenderCtx) {
		super(dictionary, ctx);
		// TODO: actually check the version Kennel supports against this
		let view = guardIfNotType(dictionary["view"], "object");
		let madeView = makeView(view, ctx);
		if (!madeView) throw new KennelError("No view to render");
		this.view = madeView;
	}

	async make() {
		return this.view.make();
	}
}
