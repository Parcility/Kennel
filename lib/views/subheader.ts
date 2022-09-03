import { RenderCtx } from "../util";
import DepictionHeaderView from "./header";

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
