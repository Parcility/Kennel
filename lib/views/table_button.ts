import type { DepictionBaseView } from ".";
import { defaultIfNotType, guardIfNotType, RenderCtx } from "../util";

export default class DepictionTableTextView implements DepictionBaseView {
	ctx: RenderCtx;
	title: string;
	// repoIcon?: string;

	action: string;
	backupAction: string;

	openExternal: boolean;

	constructor(dictionary: any, ctx: RenderCtx) {
		this.ctx = ctx;
		this.title = guardIfNotType(dictionary["title"], "string");
		this.action = guardIfNotType(dictionary["action"], "string");
		this.backupAction = defaultIfNotType(dictionary["backupAction"], "string", "");
		this.openExternal = defaultIfNotType(dictionary["openExternal"], "boolean", false);
	}

	render(): HTMLElement {
		let el = document.createElement("a");
		el.href = this.action;
		el.className = "nd-table-button";
		let titleEl = document.createElement("p");
		titleEl.className = "nd-table-button-title";
		titleEl.innerHTML = this.title;
		let chevronEl = document.createElement("span");
		chevronEl.className = "nd-table-button-chevron";
		el.appendChild(titleEl);
		el.appendChild(chevronEl);
		return el;
	}
}
