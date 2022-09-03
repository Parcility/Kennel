import { DepictionBaseView, views } from ".";
import {
	defaultIfNotType,
	guardIfNotType,
	KennelError,
	makeViews,
	RenderCtx,
	renderViews,
	undefIfNotType,
} from "../util";

export default class DepictionStackView implements DepictionBaseView {
	views: DepictionBaseView[] = [];
	isLandscape: boolean = false;
	xPadding: number = 0;
	backgroundColor?: string;
	ctx: RenderCtx;

	constructor(dictionary: any, ctx: RenderCtx) {
		this.ctx = ctx;
		let viewObjs = guardIfNotType(dictionary["views"], "array");

		let orientationString = dictionary["orientation"];
		if (typeof orientationString === "string") {
			if (orientationString !== "landscape" && orientationString !== "portrait") {
				throw new KennelError("Invalid orientation value: " + orientationString);
			}
			if (orientationString == "landscape") {
				this.isLandscape = true;
			}
		}

		this.views = makeViews(viewObjs, ctx);
		this.backgroundColor = undefIfNotType(dictionary["backgroundColor"], "string");
		this.xPadding = defaultIfNotType(dictionary["xPadding"], "number", 0);
	}

	async render(): Promise<HTMLElement> {
		const el = document.createElement("div");
		el.classList.add("nd-stack");
		if (this.isLandscape) el.classList.add("nd-stack-landscape");
		if (this.backgroundColor) el.style.backgroundColor = this.backgroundColor;
		el.style.padding = `0 ${this.xPadding}px`;
		const children = await renderViews(this.views, this.ctx);
		el.append.apply(el, children);
		return el;
	}
}
