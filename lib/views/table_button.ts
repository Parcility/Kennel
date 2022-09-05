import { createElement, setStyles } from "../renderable";
import { defaultIfNotType, guardIfNotType } from "../util";
import DepictionBaseView from "./base";

export default class DepictionTableTextView extends DepictionBaseView {
	title: string;
	// repoIcon?: string;

	action: string;
	backupAction: string;

	openExternal: boolean;

	constructor(dictionary: any) {
		super(dictionary);
		this.title = guardIfNotType(dictionary["title"], "string");
		this.action = guardIfNotType(dictionary["action"], "string");
		this.backupAction = defaultIfNotType(dictionary["backupAction"], "string", "");
		this.openExternal = defaultIfNotType(dictionary["openExternal"], "boolean", false);
	}

	async make() {
		let titleEl = createElement("p", { class: "nd-table-button-title" }, [this.title]);
		let chevronEl = createElement("span", { class: "nd-table-button-chevron" });
		let el = createElement("a", { class: "nd-table-button", href: this.action }, [titleEl, chevronEl]);
		if (this.tintColor)
			setStyles(el, {
				"--kennel-tint-color": this.tintColor,
			});
		return el;
	}
}
