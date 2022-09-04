import { createElement, RenderableElement } from "../renderable";
import { guardIfNotType, makeView, RenderCtx } from "../util";
import DepictionBaseView from "./base";

class DepictionTabPageView extends DepictionBaseView {
	tabname: string;
	view: DepictionBaseView | undefined;

	constructor(dictionary: any, ctx: RenderCtx) {
		super(dictionary, ctx);
		this.tabname = guardIfNotType(dictionary["tabname"], "string");
		this.view = makeView(dictionary, ctx);
	}
}

export default class DepictionTabView extends DepictionBaseView {
	pages: DepictionTabPageView[];
	static tabID = 0;
	static tabControlID = 0;

	constructor(dictionary: any, ctx: RenderCtx) {
		super(dictionary, ctx);
		let tabs = guardIfNotType(dictionary["tabs"], "array");
		this.pages = tabs.map((tab) => new DepictionTabPageView(tab, ctx)).filter(Boolean) as DepictionTabPageView[];
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
		const page = createElement("div", { class: "nd-tab-page" }, [tab.view && (await tab.view.make())]);
		const el = createElement("div", { class: "nd-tab" }, [input, control, page]);
		return el;
	}
}
