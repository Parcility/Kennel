import { RenderableElement } from "../renderable";
import { RenderCtx, undefIfNotType } from "../util";

export default class DepictionBaseView {
	ctx: RenderCtx;
	tintColor?: string;

	constructor(depiction: any, ctx: RenderCtx) {
		this.ctx = ctx;
		if (depiction) {
			this.tintColor = undefIfNotType(depiction["tintColor"], "string");
		}
	}

	async make(): Promise<RenderableElement> {
		throw new Error("Not implemented");
	}

	mounted?: (el: HTMLElement) => void;
}
