import { RenderOptions, createElement, setClassList, setStyles } from "../renderable";
import { constructViews, defaultIfNotType, guardIfNotType, KennelError, makeViews, undefIfNotType } from "../util";
import DepictionBaseView from "./base";

export default class DepictionStackView extends DepictionBaseView {
	views: DepictionBaseView[] = [];
	isLandscape: boolean = false;
	xPadding: number = 0;
	backgroundColor?: string;
	static viewName = "DepictionStackView";

	constructor(
		dictionary: any,
		options?: Partial<RenderOptions>
	) {
		super(dictionary, options);
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

		this.views = constructViews(viewObjs, options);
		this.backgroundColor = undefIfNotType(dictionary["backgroundColor"], "color");
		this.xPadding = defaultIfNotType(dictionary["xPadding"], "number", 0);
	}

	async make() {
		const el = createElement("div");
		setClassList(el, ["nd-stack", this.isLandscape && "nd-stack-landscape"]);
		const styles: any = {
			padding: `0 ${this.xPadding}px`,
		};
		if (this.backgroundColor) styles["background-color"] = this.backgroundColor;
		setStyles(el, styles);
		el.children = await makeViews(this.views);
		return el;
	}
}
