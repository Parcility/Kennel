import { RenderOptions, createElement, setClassList, setStyles } from "../renderable";
import { guardIfNotType, undefIfNotType, parseSize, defaultIfNotType } from "../util";
import DepictionBaseView from "./base";

interface FeaturedBanner {
	url: string;
	title?: string;
	package?: string;
	hideShadow: boolean;
}

export default class FeaturedBannersView extends DepictionBaseView {
	itemHeight: number;
	itemWidth: number;
	itemBorderRadius: number;
	banners: FeaturedBanner[];
	static viewName = "FeaturedBannersView";

	constructor(
		dictionary: any,
		options?: Partial<RenderOptions>
	) {
		super(dictionary, options);
		let rawItemSize = guardIfNotType(dictionary["itemSize"], "string");
		[this.itemWidth, this.itemHeight] = parseSize(rawItemSize);

		this.itemBorderRadius = guardIfNotType(dictionary["itemCornerRadius"], "number");

		this.banners = guardIfNotType(dictionary["banners"], "array")
			.map((banner) => this.parseBanner(banner, options))
			.filter(Boolean) as FeaturedBanner[];
	}

	parseBanner(
		dictionary: any,
		options?: Partial<RenderOptions>
	): FeaturedBanner | undefined {
		let url = guardIfNotType(dictionary["url"], "url");
		if (options?.proxyImageUrl || options?.proxyUrl) {
			url = (options?.proxyImageUrl ?? options?.proxyUrl) + encodeURIComponent(url);
		}
		let title = defaultIfNotType(dictionary["title"], "string", "");
		let pack = undefIfNotType(dictionary["package"], "string");
		let hideShadow = defaultIfNotType(dictionary["hideShadow"], "boolean", false);
		return {
			url: url,
			title: title,
			package: pack,
			hideShadow: hideShadow
		};
	}

	async make() {
		const el = createElement("div", { class: "nd-featured-banners" });
		setStyles(el, {
			"--banner-item-width": `${this.itemWidth}px`,
			"--banner-item-height": `${this.itemHeight}px`,
			"--banner-item-radius": `${this.itemBorderRadius}px`,
		});
		for (let banner of this.banners) {
			let linkEl = createElement("a", {
				class: "nd-banner-item",
				href: (banner.package ? `cydia://${banner.package}` : banner.url)
			})
			el.children.push(linkEl);

			let bannerEl = createElement("img", {
				src: banner.url,
				alt: (banner.title ?? "")
			});
			linkEl.children.push(bannerEl);

			if (banner.title) {
				let titleEl = createElement("span", {}, [banner.title]);
				if (!banner.hideShadow) {
					setClassList(titleEl, ["nd-banner-shadow"]);
				}
				linkEl.children.push(titleEl);
			}
		}
		return el;
	}
}
