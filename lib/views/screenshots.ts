import { RenderOptions, createElement, setStyles } from "../renderable";
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
	debugg: string;
	static viewName = "DepictionScreenshotsView";

	constructor(
		dictionary: any,
		options?: Partial<RenderOptions>
	) {
		super(dictionary, options);
		if (dictionary["iphone"]) dictionary = dictionary["iphone"];

		let rawItemSize = guardIfNotType(dictionary["itemSize"], "string");

		[this.itemWidth, this.itemHeight] = parseSize(rawItemSize);
		this.itemBorderRadius = defaultIfNotType(dictionary["itemBorderRadius"], "number", 0);

		this.screenshots = guardIfNotType(dictionary["screenshots"], "array")
			.map((screenshot) => this.parseScreenshot(screenshot, options))
			.filter(Boolean) as Screenshot[];
	}

	parseScreenshot(
		dictionary: any,
		options?: Partial<RenderOptions>
	): Screenshot | undefined {
		let url = guardIfNotType(dictionary["url"], "url");
		let video = defaultIfNotType(dictionary["video"], "boolean", false);

		if(video && (options?.proxyVideoUrl || options?.proxyUrl)) {
			url = (options?.proxyVideoUrl ?? options?.proxyUrl) + encodeURIComponent(url);
		} else if(!video && (options?.proxyImageUrl || options?.proxyUrl)) {
			url = (options?.proxyImageUrl ?? options?.proxyUrl) + encodeURIComponent(url);
		}

		if (typeof url !== "string") return;
		if (typeof dictionary["accessibilityText"] !== "string") return;
		return {
			url: url,
			fullSizeURL: undefIfNotType(dictionary["fullSizeURL"], "url"),
			video: video,
			accessibilityText: dictionary.accessibilityText,
		};
	}

	async make() {
		const el = createElement("div", { class: "nd-screenshots" });
		setStyles(el, {
			"--screenshot-item-width": `${this.itemWidth}px`,
			"--screenshot-item-height": `${this.itemHeight}px`,
			"--screenshot-item-radius": `${this.itemBorderRadius}px`,
			"--debugg": `${this.debugg}`,
		});
		for (let screenshot of this.screenshots) {
			let attributes = {
				class: "nd-screenshot-item" + (screenshot.video ? " nd-video" : ""),
				src: screenshot.url,
				alt: screenshot.accessibilityText,
				controls: screenshot.video
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
