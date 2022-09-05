import { createElement, setStyles } from "../renderable";
import { Alignment, applyAlignmentMargin, defaultIfNotType, getAlignment, guardIfNotType } from "../util";
import DepictionBaseView from "./base";

export default class DepictionRatingView extends DepictionBaseView {
	width: number;
	height: number;
	url: string;

	autoPlayEnabled: boolean = false;
	showPlaybackControls: boolean = false;
	loopEnabled: boolean = false;
	alignment: Alignment;
	cornerRadius: number;

	constructor(dictionary: any) {
		super(dictionary);
		this.url = guardIfNotType(dictionary["URL"], "string");
		this.width = guardIfNotType(dictionary["width"], "number");
		this.height = guardIfNotType(dictionary["height"], "number");
		this.alignment = getAlignment(dictionary["alignment"]);

		this.autoPlayEnabled = defaultIfNotType(dictionary["autoplay"], "boolean", false);
		this.showPlaybackControls = defaultIfNotType(dictionary["showPlaybackControls"], "boolean", true);
		this.loopEnabled = defaultIfNotType(dictionary["loop"], "boolean", false);

		this.cornerRadius = defaultIfNotType(dictionary["cornerRadius"], "number", 0);
	}

	async make() {
		const el = createElement("video", {
			class: "nd-video",
			src: this.url,
			controls: this.showPlaybackControls,
			loop: this.loopEnabled,
			autoplay: this.autoPlayEnabled,
		});
		setStyles(el, {
			width: `${this.width}px`,
			height: `${this.height}px`,
			"border-radius": `${this.cornerRadius}px`,
		});
		applyAlignmentMargin(el, this.alignment);
		return el;
	}
}
