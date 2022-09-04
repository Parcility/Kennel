import { createElement } from "../renderable";
import { defaultIfNotType, guardIfNotType, RenderCtx } from "../util";
import DepictionBaseView from "./base";

export default class DepictionTableTextView extends DepictionBaseView {
	ctx: RenderCtx;
	title: string;
	// repoIcon?: string;

	action: string;
	backupAction: string;

	openExternal: boolean;

	constructor(dictionary: any, ctx: RenderCtx) {
		super(dictionary, ctx);
		this.title = guardIfNotType(dictionary["title"], "string");
		this.action = guardIfNotType(dictionary["action"], "string");
		this.backupAction = defaultIfNotType(dictionary["backupAction"], "string", "");
		this.openExternal = defaultIfNotType(dictionary["openExternal"], "boolean", false);
	}

	async make() {
		let titleEl = createElement("p", { class: "nd-table-button-title" }, [this.title]);
		let chevronEl = createElement("span", { class: "nd-table-button-chevron" });
		let el = createElement("a", { class: "nd-table-button", href: this.action }, [titleEl, chevronEl]);
		return el;
	}
}
