import ButtonView from "./button";
import HeaderView from "./header";
import ImageView from "./image";
import LabelView from "./label";
import LayerView from "./layer";
import MarkdownView from "./markdown";
import ScreenshotsView from "./screenshots";
import SeparatorView from "./separator";
import SpacerView from "./spacer";
import StackView from "./stack";
import SubheaderView from "./subheader";
import WebView from "./web";
import type { RenderCtx } from "./_util";

export interface DepictionBaseView {
	isActionable?: boolean;
	isHighlighted?: boolean;
	ctx: RenderCtx;

	render(): HTMLElement | Promise<HTMLElement>;
	mounted?(el: HTMLElement): void;
}

export type DepictionViewConstructor = { new (dictionary: any, ctx: RenderCtx): DepictionBaseView };

export const views = new Map<string, DepictionViewConstructor>([
	// ["DepictionAutoStackView", AutoStackView],
	["DepictionButtonView", ButtonView],
	// ["DepictionFormViewController", FormViewController],
	["DepictionHeaderView", HeaderView],
	["DepictionImageView", ImageView],
	["DepictionLabelView", LabelView],
	["DepictionLayerView", LayerView],
	["DepictionMarkdownView", MarkdownView],
	// ["DepictionMinVersionForceView", MinVersionForceView],
	// ["DepictionReviewView", ReviewView],
	["DepictionScreenshotsView", ScreenshotsView],
	["DepictionSeparatorView", SeparatorView],
	["DepictionSpacerView", SpacerView],
	["DepictionStackView", StackView],
	["DepictionSubheaderView", SubheaderView],
	// ["DepictionTabView", TabView],
	// ["DepictionTableButtonView", TableButtonView],
	// ["DepictionTableTextView", TableTextView],
	// ["DepictionVideoView", VideoView],
	["DepictionWebView", WebView],
]);
