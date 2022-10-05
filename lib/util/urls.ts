export function isValidHttpUrl(string: string): boolean {
	let url;
	try {
		url = new URL(string);
	} catch (_) {
		return false;
	}
	return url.protocol === "http:" || url.protocol === "https:";
}

export function isValidHttpUrlExtended(string: string): boolean {
	if(isValidHttpUrl(string)) {
		return true;
	}
	let url;
	try {
		url = new URL(string);
	} catch (_) {
		return false;
	}
	return url.protocol == "depiction-http:" || url.protocol == "depiction-https:" ||
				 url.protocol == "form-http:" || url.protocol == "form-https:";
}