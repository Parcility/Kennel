import { createElement, setStyles } from "../renderable";
import { buttonLinkHandler, defaultIfNotType, guardIfNotType } from "../util";
import DepictionBaseView from "./base";

export default class DepictionTableTextView extends DepictionBaseView {
	title: string;
	action: string;
	openExternal: boolean;

	constructor(dictionary: any) {
		super(dictionary);
		this.title = guardIfNotType(dictionary["title"], "string");
		this.action = guardIfNotType(dictionary["action"], "string");
		this.openExternal = defaultIfNotType(dictionary["openExternal"], "boolean", false);
	}

	async make() {
		let titleEl = createElement("p", { class: "nd-table-button-title" }, [this.title]);
		let chevronEl = createElement("span", { class: "nd-table-button-chevron" });
		let el = createElement("a", { class: "nd-table-button", href: buttonLinkHandler(this.action, this.title) }, [
			titleEl,
			chevronEl,
		]);
		if (this.openExternal) el.attributes.target = "_blank";
		if (this.tintColor)
			setStyles(el, {
				"--kennel-tint-color": this.tintColor,
			});
		return el;
	}
}
