import { DepictionBaseView, views } from ".";
import { makeViews, RenderCtx, renderViews } from "./_util";

export default class DepictionStackView implements DepictionBaseView {
	views: DepictionBaseView[] = [];
	isLandscape: boolean = false;
	xPadding: number = 0;
	backgroundColor: string;
	ctx: RenderCtx;

	constructor(dictionary: any, ctx: RenderCtx) {
		this.ctx = ctx;
		let viewObjs = dictionary["views"];
		if (!Array.isArray(viewObjs)) return;

		let orientationString = dictionary["orientation"];
		if (typeof orientationString === "string") {
			if (orientationString !== "landscape" && orientationString !== "portrait") {
				return;
			}
			if (orientationString == "landscape") {
				this.isLandscape = true;
			}
		}

		this.views = makeViews(viewObjs, ctx);

		let backgroundColor = dictionary["backgroundColor"];
		if (typeof backgroundColor === "string") {
			this.backgroundColor = backgroundColor;
		}

		let xPadding = dictionary["xPadding"];
		if (typeof xPadding === "number") {
			this.xPadding = xPadding;
		}
	}

	async render(): Promise<HTMLElement> {
		const el = document.createElement("div");
		el.classList.add("nd-stack");
		if (this.isLandscape) el.classList.add("nd-stack-landscape");
		el.style.padding = `0 ${this.xPadding}px`;
		const children = await renderViews(this.views, this.ctx);
		el.append.apply(el, children);
		return el;
	}
}
