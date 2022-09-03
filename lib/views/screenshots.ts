import type { DepictionBaseView } from ".";
import { parseSize, RenderCtx } from "./_util";

interface Screenshot {
	url: string;
	video: boolean;
	accessibilityText: string;
}

export default class DepictionScreenshotsView implements DepictionBaseView {
	screenshots: Screenshot[];
	itemWidth: number;
	itemHeight: number;
	itemBorderRadius: number;
	ctx: RenderCtx;

	constructor(dictionary: any, ctx: RenderCtx) {
		// TODO: do proper checks, like other views
		this.ctx = ctx;
		let [width, height] = parseSize(dictionary.itemSize);
		this.itemWidth = width;
		this.itemHeight = height;
		this.itemBorderRadius = dictionary.itemCornerRadius || 0;
		this.screenshots = dictionary.screenshots ?? [];
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
			el.appendChild(mediaEl);
		}
		return el;
	}
}
