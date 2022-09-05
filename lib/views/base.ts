import { RenderableElement } from "../renderable";
import { undefIfNotType } from "../util";

export default class DepictionBaseView {
	tintColor?: string;

	constructor(depiction: any) {
		if (depiction) {
			this.tintColor = undefIfNotType(depiction["tintColor"], "string");
		}
	}

	async make(): Promise<RenderableElement> {
		throw new Error("Not implemented");
	}

	mounted?(el: HTMLElement): void;
}
