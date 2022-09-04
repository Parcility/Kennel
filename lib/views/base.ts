import { RenderableElement } from "../renderable";
import { RenderCtx } from "../util";

export default class DepictionBaseView {
	ctx: RenderCtx;

	constructor(dictionary: any, ctx: RenderCtx) {
		this.ctx = ctx;
	}

	async make(): Promise<RenderableElement> {
		throw new Error("Not implemented");
	}

	mounted?: (el: HTMLElement) => void;
}
