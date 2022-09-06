import { constructView, guardIfNotType, KennelError, makeView } from "../util";
import DepictionBaseView from "./base";

export default class DepictionMinVersionForceView extends DepictionBaseView {
	view: DepictionBaseView;
	static viewName = "DepictionMinVersionForceView";

	constructor(dictionary: any) {
		super(dictionary);
		// TODO: actually check the version Kennel supports against this
		let view = guardIfNotType(dictionary["view"], "object");
		let madeView = constructView(view);
		if (!madeView) throw new KennelError("No view to render");
		this.view = madeView;
	}

	async make() {
		return makeView(this.view);
	}
}
