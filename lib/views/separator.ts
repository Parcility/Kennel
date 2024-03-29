import { createElement } from "../renderable";
import DepictionBaseView from "./base";

export default class DepictionSeparatorView extends DepictionBaseView {
	static viewName = "DepictionSeparatorView";
	async make() {
		return createElement("hr", { class: "nd-separator" });
	}
}
