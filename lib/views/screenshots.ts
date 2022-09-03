import type { DepictionBaseView } from ".";
import { defaultIfNotType, parseSize, RenderCtx } from "./_util";

interface Screenshot {
	url: string;
	fullSizeURL?: string;
	video: boolean;
	accessibilityText: string;
}

export default class DepictionScreenshotsView implements DepictionBaseView {
	screenshots: Screenshot[];
	itemWidth: number;
	itemHeight: number;
	itemBorderRadius: number;
	isPaging: boolean;
	ctx: RenderCtx;

	constructor(dictionary: any, ctx: RenderCtx) {
		this.ctx = ctx;
		if (dictionary["iphone"]) dictionary = dictionary["iphone"];

		let rawItemSize = dictionary["itemSize"];
		if (typeof rawItemSize !== "string") return;

		[this.itemWidth, this.itemHeight] = parseSize(rawItemSize);
		this.itemBorderRadius = defaultIfNotType(dictionary["itemBorderRadius"], "number", 0);

		let screenshots = dictionary["screenshots"];
		if (!Array.isArray(screenshots)) return;

		this.screenshots = screenshots.map(this.parseScreenshot).filter(Boolean) as Screenshot[];
	}

	parseScreenshot(dictionary: any): Screenshot | undefined {
		if (typeof dictionary["url"] !== "string") return;
		if (typeof dictionary["accessibilityText"] !== "string") return;
		return {
			url: dictionary.url,
			fullSizeURL: defaultIfNotType(dictionary["fullSizeURL"], "string", undefined),
			video: defaultIfNotType(dictionary["video"], "boolean", false),
			accessibilityText: dictionary.accessibilityText,
		};
	}

	render(): HTMLElement {
		const el = document.createElement("div");
		el.className = "nd-screenshots";
		el.style.setProperty("--screenshot-item-width", `${this.itemWidth}px`);
		el.style.setProperty("--screenshot-item-height", `${this.itemHeight}px`);
		el.style.setProperty("--screenshot-item-radius", `${this.itemBorderRadius}px`);
		for (let screenshot of this.screenshots) {
			let mediaEl = screenshot.video ? document.createElement("video") : document.createElement("img");
			mediaEl.className = "nd-screenshot-item";
			mediaEl.src = screenshot.url;
			if (mediaEl instanceof HTMLImageElement) {
				mediaEl.alt = screenshot.accessibilityText;
			}
			if (screenshot.fullSizeURL) {
				let link = document.createElement("a");
				link.href = screenshot.fullSizeURL;
				link.target = "_blank";
				el.appendChild(link);
			} else {
				el.appendChild(mediaEl);
			}
		}
		return el;
	}
}
