import { createElement, RenderableElement, setClassList } from "../renderable";
import { defaultIfNotType, guardIfNotType, makeView, RenderCtx, renderView } from "../util";
import DepictionBaseView from "./base";

export default class DepictionButtonView extends DepictionBaseView {
	text?: string;
	children?: DepictionBaseView;
	action: string;
	isLink: boolean;
	yPadding: number;
	openExternal: boolean;
	backupAction: string;

	constructor(dictionary: any, ctx: RenderCtx) {
		super(dictionary, ctx);
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

	async make(): Promise<RenderableElement> {
		let el = createElement(this.isLink ? "a" : "button");
		// let el = this.isLink ? document.createElement("a") : document.createElement("button");
		el.attributes.class = "nd-button";
		if (this.isLink) {
			el.attributes.href = this.action;
		}

		if (this.children) {
			this.children;
			let child = await this.children.make();
			child.attributes.pointerEvents = "none";
			el.children = [child];
		} else if (this.text) {
			el.children = [this.text];
		}
		return el;
	}
}
