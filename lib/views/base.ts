import { RenderOptions, RenderableElement } from "../renderable";
import { defaultIfNotType, undefIfNotType } from "../util";

export default abstract class DepictionBaseView {
	tintColor?: string;
	static viewName = "DepictionBaseView";

	constructor(
		depiction: any,
		options?: Partial<RenderOptions>
	) {
		if (depiction) {
			this.tintColor = undefIfNotType(defaultIfNotType(depiction["tintColor"], "color", options?.defaultTintColor as string), "color");
		}
	}

	abstract make(): Promise<RenderableElement>;
}
