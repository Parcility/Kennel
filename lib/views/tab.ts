import { createElement, RenderableElement, setStyles } from "../renderable";
import { constructView, guardIfNotType, makeView } from "../util";
import DepictionBaseView from "./base";

class DepictionTabPageView extends DepictionBaseView {
	tabname: string;
	view: DepictionBaseView | undefined;

	constructor(dictionary: any) {
		super(dictionary);
		this.tabname = guardIfNotType(dictionary["tabname"], "string");
		this.view = constructView(dictionary);
	}
}

export default class DepictionTabView extends DepictionBaseView {
	pages: DepictionTabPageView[];
	static tabID = 0;
	static tabControlID = 0;

	constructor(dictionary: any) {
		super(dictionary);
		let tabs = guardIfNotType(dictionary["tabs"], "array");
		this.pages = tabs.map((tab) => new DepictionTabPageView(tab)).filter(Boolean) as DepictionTabPageView[];
	}

	async make() {
		DepictionTabView.tabControlID++;
		const children = await Promise.all(this.pages.map((tab, i) => this.makeTab(tab, i === 0)));
		const el = createElement("form", { class: "nd-tabs" }, children);
		return el;
	}

	async makeTab(tab: DepictionTabPageView, isActive: boolean): Promise<RenderableElement> {
		let numericControlID = DepictionTabView.tabControlID++;
		let id = "kennel-tab-" + numericControlID;
		const input = createElement("input", {
			type: "radio",
			id,
			name: "kennel-tab-id-" + DepictionTabView.tabID,
			checked: isActive,
		});
		const control = createElement("label", { class: "nd-tab-control", for: id }, [tab.tabname]);

		const page = createElement("div", { class: "nd-tab-page" }, [tab.view && (await makeView(tab.view))]);
		const el = createElement("div", { class: "nd-tab" }, [input, control, page]);
		if (this.tintColor)
			setStyles(el, {
				"--kennel-tint-color": this.tintColor,
			});
		return el;
	}
}
