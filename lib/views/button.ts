import { createElement, RenderableElement, setClassList, setStyles } from "../renderable";
import { buttonLinkHandler, constructView, defaultIfNotType, guardIfNotType, makeView, undefIfNotType } from "../util";
import DepictionBaseView from "./base";

export default class DepictionButtonView extends DepictionBaseView {
	text?: string;
	children?: DepictionBaseView;
	action: string;
	isLink: boolean;
	yPadding: number;
	openExternal: boolean;
	static viewName = "DepictionButtonView";

	constructor(dictionary: any) {
		super(dictionary);
		this.isLink = defaultIfNotType(dictionary["isLink"], "boolean", false);
		this.yPadding = defaultIfNotType(dictionary["yPadding"], "number", 0);
		let action = undefIfNotType(dictionary["action"], "urlExtended");
		if(typeof action !== "string") {
			this.action = guardIfNotType(dictionary["backupAction"], "urlExtended");
		} else {
			this.action = action;
		}
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
		let el = createElement("a");
		setClassList(el, ["nd-button", this.isLink ? "nd-button-link" : "nd-button-not-link"]);
		let styles: any = {};
		if (this.tintColor) styles["--kennel-tint-color"] = this.tintColor;
		buttonLinkHandler(el, this.action, this.text);
		if (this.isLink) {
			styles.color = "var(--kennel-tint-color)";
		} else {
			styles["background-color"] = "var(--kennel-tint-color)";
			styles["color"] = "white";
		}

		if (this.openExternal) {
			el.attributes.target = "_blank";
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
