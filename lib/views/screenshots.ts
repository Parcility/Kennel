import { createElement, setStyles } from "../renderable";
import { defaultIfNotType, guardIfNotType, parseSize, undefIfNotType } from "../util";
import DepictionBaseView from "./base";

interface Screenshot {
	url: string;
	fullSizeURL?: string;
	video: boolean;
	accessibilityText: string;
}

export default class DepictionScreenshotsView extends DepictionBaseView {
	screenshots: Screenshot[];
	itemWidth: number;
	itemHeight: number;
	itemBorderRadius: number;
	static viewName = "DepictionScreenshotsView";

	constructor(dictionary: any) {
		super(dictionary);
		if (dictionary["iphone"]) dictionary = dictionary["iphone"];

		let rawItemSize = guardIfNotType(dictionary["itemSize"], "string");

		[this.itemWidth, this.itemHeight] = parseSize(rawItemSize);
		this.itemBorderRadius = defaultIfNotType(dictionary["itemBorderRadius"], "number", 0);

		this.screenshots = guardIfNotType(dictionary["screenshots"], "array")
			.map(this.parseScreenshot)
			.filter(Boolean) as Screenshot[];
	}

	parseScreenshot(dictionary: any): Screenshot | undefined {
		dictionary["url"] = undefIfNotType(dictionary["url"], "url");
		if (typeof dictionary["url"] !== "string") return;
		if (typeof dictionary["accessibilityText"] !== "string") return;
		return {
			url: dictionary["url"],
			fullSizeURL: undefIfNotType(dictionary["fullSizeURL"], "url"),
			video: defaultIfNotType(dictionary["video"], "boolean", false),
			accessibilityText: dictionary.accessibilityText,
		};
	}

	async make() {
		const el = createElement("div", { class: "nd-screenshots" });
		setStyles(el, {
			"--screenshot-item-width": `${this.itemWidth}px`,
			"--screenshot-item-height": `${this.itemHeight}px`,
			"--screenshot-item-radius": `${this.itemBorderRadius}px`,
		});
		for (let screenshot of this.screenshots) {
			let attributes = {
				class: "nd-screenshot-item",
				src: screenshot.url,
				alt: screenshot.accessibilityText,
			};
			let mediaEl = screenshot.video ? createElement("video", attributes) : createElement("img", attributes);
			if (screenshot.fullSizeURL) {
				let link = createElement("a", {
					href: screenshot.fullSizeURL,
					target: "_blank",
				});
				el.children.push(link);
			} else {
				el.children.push(mediaEl);
			}
		}
		return el;
	}
}
