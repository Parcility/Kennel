import { RenderableElement } from "../renderable";
import { undefIfNotType } from "../util";

export default abstract class DepictionBaseView {
	tintColor?: string;

	constructor(depiction: any) {
		if (depiction) {
			this.tintColor = undefIfNotType(depiction["tintColor"], "string");
		}
	}

	abstract make(): Promise<RenderableElement>;
}
