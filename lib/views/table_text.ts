import { createElement } from "../renderable";
import { guardIfNotType, RenderCtx } from "../util";
import DepictionBaseView from "./base";

export default class DepictionTableTextView extends DepictionBaseView {
	title: string;
	text: string;

	constructor(dictionary: any, ctx: RenderCtx) {
		super(dictionary, ctx);
		this.title = guardIfNotType(dictionary["title"], "string");
		this.text = guardIfNotType(dictionary["text"], "string");
	}

	async make() {
		let titleEl = createElement("p", { class: "nd-table-text-title" }, [this.title]);
		let textEl = createElement("p", { class: "nd-table-text-text" }, [this.text]);
		let el = createElement("div", { class: "nd-table-text" }, [titleEl, textEl]);
		return el;
	}
}
