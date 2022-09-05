import { createElement, RenderableElement, setStyles } from "../renderable";
import { constructView, defaultIfNotType, guardIfNotType, makeView } from "../util";
import DepictionBaseView from "./base";

export default class DepictionButtonView extends DepictionBaseView {
	text?: string;
	children?: DepictionBaseView;
	action: string;
	isLink: boolean;
	yPadding: number;
	openExternal: boolean;
	backupAction: string;

	constructor(dictionary: any) {
		super(dictionary);
		this.isLink = defaultIfNotType(dictionary["isLink"], "boolean", false);
		this.action = guardIfNotType(dictionary["action"], "string");

		this.yPadding = defaultIfNotType(dictionary["yPadding"], "number", 0);

		// self.action = action
		this.backupAction = defaultIfNotType(dictionary["backupAction"], "string", "");

		this.openExternal = defaultIfNotType(dictionary["openExternal"], "boolean", false);

		let dict = dictionary["view"];
		if (typeof dict === "object") {
			this.children = constructView(dict);
		}

		if (!this.children) {
			let text = dictionary["text"];
			if (typeof text === "string") {
				this.text = text;
			}
		}
	}

	async make(): Promise<RenderableElement> {
		let el = createElement(this.isLink ? "a" : "button", { class: "nd-button" });
		let styles: any = {};
		if (this.tintColor) styles["--kennel-tint-color"] = this.tintColor;
		if (this.isLink) {
			el.attributes.href = this.action;
			styles.color = "var(--kennel-tint-color)";
		} else {
			styles["background-color"] = "var(--kennel-tint-color)";
			styles["color"] = "white";
		}

		if (this.children) {
			this.children;
			let child = await makeView(this.children);
			child.attributes.pointerEvents = "none";
			el.children = [child];
		} else if (this.text) {
			el.children = [this.text];
		}
		setStyles(el, styles);
		return el;
	}
}
