import { createElement } from "../renderable";
import { guardIfNotType } from "../util";
import DepictionBaseView from "./base";

export default class DepictionTableTextView extends DepictionBaseView {
	title: string;
	text: string;
	static viewName = "DepictionTableTextView";

	constructor(dictionary: any) {
		super(dictionary);
		this.title = guardIfNotType(dictionary["title"], "string");
		this.text = guardIfNotType(dictionary["text"], "string");
	}

	async make() {
		return createElement("div", { class: "nd-table-text" }, [
			createElement("p", { class: "nd-table-text-title" }, [this.title]),
			createElement("p", { class: "nd-table-text-text" }, [this.text]),
		]);
	}
}
