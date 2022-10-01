import { createElement, setStyles } from "../renderable";
import { buttonLinkHandler, defaultIfNotType, guardIfNotType, undefIfNotType } from "../util";
import DepictionBaseView from "./base";

export default class DepictionTableButtonView extends DepictionBaseView {
	title: string;
	action: string;
	openExternal: boolean;
	static viewName = "DepictionTableButtonView";

	constructor(dictionary: any) {
		super(dictionary);
		this.title = guardIfNotType(dictionary["title"], "string");
		this.action = undefIfNotType(dictionary["action"], "urlExtended");
		if(typeof this.action !== "string") {
			this.action = guardIfNotType(dictionary["backupAction"], "urlExtended");
		}
		this.openExternal = defaultIfNotType(dictionary["openExternal"], "boolean", false);
	}

	async make() {
		let titleEl = createElement("p", { class: "nd-table-button-title" }, [this.title]);
		let chevronEl = createElement("span", { class: "nd-table-button-chevron" });
		let el = createElement("a", { class: "nd-table-button" }, [titleEl, chevronEl]);
		buttonLinkHandler(el, this.action, this.title);
		if (this.openExternal) el.attributes.target = "_blank";
		if (this.tintColor)
			setStyles(el, {
				"--kennel-tint-color": this.tintColor,
			});
		return el;
	}
}
