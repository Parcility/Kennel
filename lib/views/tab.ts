import type { DepictionBaseView } from ".";
import { guardIfNotType, isType, makeView, makeViews, RenderCtx, renderViews } from "../util";

type DepictionTabPageView = DepictionBaseView & { tabname: string };

export default class DepictionTabView implements DepictionBaseView {
	pages: DepictionTabPageView[];
	ctx: RenderCtx;

	constructor(dictionary: any, ctx: RenderCtx) {
		this.ctx = ctx;
		let tabs = guardIfNotType(dictionary["tabs"], "array");
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
		el.className = "nd-tab-control";
		el.innerHTML = tab.tabname;
		el.dataset.target = tab.htmlID;
		return el;
	}

	mounted(el: HTMLElement) {
		// get tab controls
		let tabControls;
		for (let i = 0; i < el.children.length; i++) {
			let child = el.children[i];
			if (child.classList.contains("nd-tab-controls")) {
				tabControls = child.querySelectorAll<HTMLButtonElement>("[data-target]");
				break;
			}
		}
		if (!tabControls) return;

		// get pages container
		let pagesContainer;
		for (let i = 0; i < el.children.length; i++) {
			let child = el.children[i];
			if (child.classList.contains("nd-tab-pages")) {
				pagesContainer = child;
				break;
			}
		}
		if (!pagesContainer) return;

		// get tabs
		const tabs = [...tabControls]
			.map((el) => el.dataset.target)
			.map((target) => {
				if (!target) return;
				for (let i = 0, len = pagesContainer.children.length; i < len; i++) {
					let child = pagesContainer.children[i];
					if (child.id !== target) continue;
					return child;
				}
			})
			.filter(Boolean) as HTMLElement[];

		// bind event
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
