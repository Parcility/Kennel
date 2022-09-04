import { createElement, RenderableElement } from "../renderable";
import { guardIfNotType, makeView, RenderCtx, renderViews } from "../util";
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
	ctx: RenderCtx;

	constructor(dictionary: any, ctx: RenderCtx) {
		super(dictionary, ctx);
		let tabs = guardIfNotType(dictionary["tabs"], "array");
		this.pages = tabs.map((tab) => new DepictionTabPageView(tab, ctx)).filter(Boolean) as DepictionTabPageView[];
	}

	async make() {
		const children = await Promise.all(this.pages.map((tab) => this.makeTab(tab)));
		const el = createElement("div", { class: "nd-tabs" }, children);
		return el;
	}

	async makeTab(tab: DepictionTabPageView): Promise<RenderableElement> {
		const control = createElement("button", { class: "nd-tab-control" }, [tab.tabname]);
		const page = createElement("div", { class: "nd-tab-page" }, [tab.view && (await tab.view.make())]);
		const el = createElement("div", { class: "nd-tab-page-container" }, [control, page]);
		return el;
	}
}
