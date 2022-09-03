import DepictionHeaderView from "./header";
import { RenderCtx } from "./_util";

export default class DepictionSubheaderView extends DepictionHeaderView {
	constructor(dictionary: any, ctx: RenderCtx) {
		super(dictionary, ctx);
	}

	render(): HTMLElement {
		let el = super.render();
		el.className = "nd-subheader";
		return el;
	}
}
