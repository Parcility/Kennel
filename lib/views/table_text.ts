import type { DepictionBaseView } from ".";
import { guardIfNotType, RenderCtx } from "../util";

export default class DepictionTableTextView implements DepictionBaseView {
	ctx: RenderCtx;
	title: string;
	text: string;

	constructor(dictionary: any, ctx: RenderCtx) {
		this.ctx = ctx;
		this.title = guardIfNotType(dictionary["title"], "string");
		this.text = guardIfNotType(dictionary["text"], "string");
	}

	render(): HTMLElement {
		let el = document.createElement("div");
		el.className = "nd-table-text";
		let titleEl = document.createElement("p");
		titleEl.className = "nd-table-text-title";
		titleEl.innerHTML = this.title;
		el.appendChild(titleEl);
		let textEl = document.createElement("p");
		textEl.className = "nd-table-text-text";
		textEl.innerHTML = this.text;
		el.appendChild(textEl);
		return el;
	}
}
