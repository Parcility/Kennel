import type { DepictionBaseView } from ".";
import {
	Alignment,
	applyAlignmentMargin,
	defaultIfNotType,
	getAlignment,
	guardIfNotType,
	RenderCtx,
	textAlignment,
} from "../util";

export default class DepictionRatingView implements DepictionBaseView {
	ctx: RenderCtx;
	width: number;
	height: number;
	url: string;

	autoPlayEnabled: boolean = false;
	showPlaybackControls: boolean = false;
	loopEnabled: boolean = false;
	alignment: Alignment;
	cornerRadius: number;

	constructor(dictionary: any, ctx: RenderCtx) {
		console.log("Video VIEw", dictionary);
		this.ctx = ctx;
		this.url = guardIfNotType(dictionary["URL"], "string");
		this.width = guardIfNotType(dictionary["width"], "number");
		this.height = guardIfNotType(dictionary["height"], "number");
		this.alignment = getAlignment(dictionary["alignment"]);

		this.autoPlayEnabled = defaultIfNotType(dictionary["autoplay"], "boolean", false);
		this.showPlaybackControls = defaultIfNotType(dictionary["showPlaybackControls"], "boolean", true);
		this.loopEnabled = defaultIfNotType(dictionary["loop"], "boolean", false);

		this.cornerRadius = defaultIfNotType(dictionary["cornerRadius"], "number", 0);
	}

	render(): HTMLElement {
		const el = document.createElement("video");
		el.className = "nd-video";
		el.style.borderRadius = this.cornerRadius + "px";
		applyAlignmentMargin(el, this.alignment);
		el.style.width = this.width + "px";
		el.style.height = this.height + "px";
		el.loop = this.loopEnabled;
		el.controls = this.showPlaybackControls;
		el.autoplay = this.autoPlayEnabled;
		el.src = this.url;
		return el;
	}
}
