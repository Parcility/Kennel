import type { DepictionBaseView } from ".";
import { makeView, makeViews, RenderCtx, renderViews } from "./_util";

type DepictionTabPageView = DepictionBaseView & { tabname: string };

export default class DepictionTabView implements DepictionBaseView {
	pages: DepictionTabPageView[];
	ctx: RenderCtx;

	constructor(dictionary: any, ctx: RenderCtx) {
		this.ctx = ctx;
		let tabs = dictionary["tabs"];
		if (!Array.isArray(tabs)) return;
		console.log(tabs);
		this.pages = tabs
			.map((tab) => {
				let tabname = tab["tabname"];
				if (typeof tabname !== "string") return;
				let className = tab["class"];
				if (typeof className !== "string") return;
				let tabPage = makeView(tab, ctx) as DepictionTabPageView;
				tabPage.tabname = tabname;
				tabPage.htmlID = "tab-" + tabname.toLowerCase().replace(/\s/g, "-");
				return tabPage;
			})
			.filter(Boolean) as DepictionTabPageView[];
	}

	async render(): Promise<HTMLElement> {
		console.log(this);
		const el = document.createElement("div");
		el.className = "nd-tabs";
		const tabControls = document.createElement("div");
		tabControls.className = "nd-tab-controls";
		const controls = this.pages.map(this.buildTabControls);
		tabControls.append.apply(tabControls, controls);

		// build tabs
		const tabPages = document.createElement("div");
		tabPages.className = "nd-tab-pages";
		const pages = await renderViews(this.pages, this.ctx);
		for (let i = 0, len = pages.length; i < len; i++) {
			let el = pages[i];
			if (!el) continue;
			if (i !== 0) el.classList.add("nd-tab-page-inactive");
			tabPages.append(el);
		}
		tabPages.append.apply(tabPages, pages);
		el.append(tabControls, tabPages);
		return el;
	}

	buildTabControls(tab: DepictionTabPageView): HTMLElement {
		let el = document.createElement("button");
		el.innerHTML = tab.tabname;
		el.dataset.target = tab.htmlID;
		return el;
	}

	mounted(el: HTMLElement) {
		console.log(el);
		const tabControls = document.querySelectorAll<HTMLButtonElement>("[data-target]");
		const tabs = [...tabControls]
			.map((el) => el.dataset.target)
			.map((target) => {
				if (!target) return;
				return document.getElementById(target);
			})
			.filter(Boolean) as HTMLElement[];
		for (let control of tabControls) {
			control.addEventListener("click", this.onTabClick.bind(tabs));
		}
	}

	onTabClick(this: [HTMLElement], e: Event) {
		let target = e.target as HTMLElement;
		let targetID = target.dataset.target;
		for (let tab of this) {
			if (tab.id === targetID) {
				tab.classList.remove("nd-tab-page-inactive");
			} else {
				tab.classList.add("nd-tab-page-inactive");
			}
		}
	}
}
