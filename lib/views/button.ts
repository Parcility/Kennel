import { DepictionBaseView, views } from ".";
import { defaultIfNotType, guardIfNotType, makeView, RenderCtx, renderView } from "../util";

export default class DepictionButtonView implements DepictionBaseView {
	text?: string;
	children?: DepictionBaseView;
	action: string;
	isLink: boolean;
	yPadding: number;
	openExternal: boolean;
	backupAction: string;
	ctx: RenderCtx;

	constructor(dictionary: any, ctx: RenderCtx) {
		this.ctx = ctx;
		this.isLink = defaultIfNotType(dictionary["isLink"], "boolean", false);
		this.action = guardIfNotType(dictionary["action"], "string");

		this.yPadding = defaultIfNotType(dictionary["yPadding"], "number", 0);

		// self.action = action
		this.backupAction = defaultIfNotType(dictionary["backupAction"], "string", "");

		this.openExternal = defaultIfNotType(dictionary["openExternal"], "boolean", false);

		let dict = dictionary["view"];
		if (typeof dict === "object") {
			this.children = makeView(dict, ctx);
		}

		if (!this.children) {
			let text = dictionary["text"];
			if (typeof text === "string") {
				this.text = text;
			}
		}
	}

	async render(): Promise<HTMLElement> {
		let el = this.isLink ? document.createElement("a") : document.createElement("button");
		el.className = "nd-button";

		if (this.isLink && el instanceof HTMLAnchorElement) {
			el.href = this.action;
		}

		if (this.children) {
			let child = await renderView(this.children, this.ctx);
			child.style.pointerEvents = "none";
			el.appendChild(child);
		} else if (this.text) {
			el.innerHTML = this.text;
		}
		return el;
	}
}
