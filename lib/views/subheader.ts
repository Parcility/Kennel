import { setClassList } from "../renderable";
import DepictionHeaderView from "./header";

export default class DepictionSubheaderView extends DepictionHeaderView {
	async make() {
		let el = await super.make();
		setClassList(el, [
			"nd-subheader",
			this.bold && "nd-subheader-bold",
			this.useMargins && "nd-subheader-margins",
			this.useBottomMargin && "nd-subheader-bottom-margin",
		]);
		return el;
	}
}
