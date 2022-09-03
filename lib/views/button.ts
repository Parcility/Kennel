import { DepictionBaseView, views } from ".";
import { makeView, RenderCtx, renderView } from "./_util";

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
		this.isLink = dictionary["isLink"] ?? false;
		this.action = dictionary["action"];
		if (typeof this.action !== "string") {
			return;
		}

		this.yPadding = dictionary["yPadding"];
		if (typeof this.yPadding !== "number") {
			this.yPadding = 0;
		}

		// button = DepictionButton(type: .custom)

		// self.action = action
		this.backupAction = dictionary["backupAction"];
		if (typeof this.backupAction !== "string") {
			this.backupAction = "";
		}

		this.openExternal = dictionary["openExternal"];
		if (typeof this.openExternal !== "boolean") {
			this.openExternal = false;
		}

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
