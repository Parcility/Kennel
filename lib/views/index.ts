export type { default as DepictionBaseView } from "./base";

import AutoStackView from "./auto_stack";
import ButtonView from "./button";
import HeaderView from "./header";
import ImageView from "./image";
import LabelView from "./label";
import LayerView from "./layer";
import MarkdownView from "./markdown";
import MinVersionForceView from "./min_version";
import RatingView from "./rating";
import ReviewView from "./review";
import ScreenshotsView from "./screenshots";
import SeparatorView from "./separator";
import SpacerView from "./spacer";
import StackView from "./stack";
import SubheaderView from "./subheader";
import TabView from "./tab";
import TableButtonView from "./table_button";
import TableTextView from "./table_text";
import VideoView from "./video";
import WebView from "./web";

import DepictionBaseView from "./base";

export type DepictionViewConstructor<T extends DepictionBaseView> = {
	new (dictionary: any): T;
	viewName: string;
	hydrate?(el: HTMLElement): void;
};

export const views = new Map<string, DepictionViewConstructor<any>>([
	["DepictionAutoStackView", AutoStackView],
	["DepictionButtonView", ButtonView],
	["DepictionHeaderView", HeaderView],
	["DepictionImageView", ImageView],
	["DepictionLabelView", LabelView],
	["DepictionLayerView", LayerView],
	["DepictionMarkdownView", MarkdownView],
	["DepictionMinVersionForceView", MinVersionForceView],
	["DepictionRatingView", RatingView],
	["DepictionReviewView", ReviewView],
	["DepictionScreenshotsView", ScreenshotsView],
	["DepictionSeparatorView", SeparatorView],
	["DepictionSpacerView", SpacerView],
	["DepictionStackView", StackView],
	["DepictionSubheaderView", SubheaderView],
	["DepictionTabView", TabView],
	["DepictionTableButtonView", TableButtonView],
	["DepictionTableTextView", TableTextView],
	["DepictionVideoView", VideoView],
	["DepictionWebView", WebView],
]);

export const mountable = new Map<string, DepictionViewConstructor<any>>(
	Array.from(views.values()).map((v) => [v.viewName, v])
);
