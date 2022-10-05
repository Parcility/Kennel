import { RenderOptions, createElement, setStyles } from "../renderable";
import { buttonLinkHandler, defaultIfNotType, guardIfNotType, undefIfNotType } from "../util";
import DepictionBaseView from "./base";

export default class DepictionTableButtonView extends DepictionBaseView {
	title: string;
	action: string;
	openExternal: boolean;
	static viewName = "DepictionTableButtonView";

	constructor(
		dictionary: any,
		options?: Partial<RenderOptions>
	) {
		super(dictionary, options);
		this.title = guardIfNotType(dictionary["title"], "string");
		let action = undefIfNotType(dictionary["action"], "urlExtended");
		if(typeof action !== "string") {
			this.action = guardIfNotType(dictionary["backupAction"], "urlExtended");
		} else {
			this.action = action;
		}
		[this.action, this.title] = buttonLinkHandler(this.action, this.title, options);
		this.openExternal = defaultIfNotType(dictionary["openExternal"], "boolean", false);
	}

	async make() {
		let titleEl = createElement("p", { class: "nd-table-button-title" }, [this.title]);
		let chevronEl = createElement("span", { class: "nd-table-button-chevron" });
		let el = createElement("a", { class: "nd-table-button" }, [titleEl, chevronEl]);
		el.attributes.href = this.action;
		if (this.openExternal) el.attributes.target = "_blank";
		if (this.tintColor)
			setStyles(el, {
				"--kennel-tint-color": this.tintColor,
			});
		return el;
	}
}
