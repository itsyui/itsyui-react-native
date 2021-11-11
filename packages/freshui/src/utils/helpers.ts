import { Language, DateTimeMode, ImageExtensions } from "./constants";

export function getUserPreferredLang() {
	let locale = window.navigator.language.split("-")[0];
	if (localStorage["FV_TENANT_INFO"]) {
		const user = JSON.parse(localStorage["FV_TENANT_INFO"]);
		if (user && user.userAttributes) {
			locale = user.userAttributes.preferredLang;
		}
	}
	let value = Language.find(lang => lang === locale);
	if (!value) {
		value = "en";
	}
	return value;
}

export function getDateTimeLocale(locale) {
	switch (locale) {
		case "de":
			return "de-DE";
		case "fr":
			return "fr-FR";
		default:
			return "en-GB";
	}
}

export const getDate = (date, type) => {
	if (date) {
		const locale = getUserPreferredLang();
		const dateLocale = getDateTimeLocale(locale);
		let dateValue = new Date(date);
		if (dateValue.toString() === "Invalid Date") {
			dateValue = new Date(parseInt(date, 10));
		}
		if (type === DateTimeMode.DATE) {
			return dateValue.toLocaleDateString(dateLocale);
		} else if (type === DateTimeMode.TIME) {
			return dateValue.toLocaleTimeString(dateLocale);
		}
		return dateValue.toLocaleString(dateLocale);
	}
	return "";
};

export function isImageEncoded(imgSrc: string) {
	if (imgSrc) {
		const splitSrc = imgSrc.split(",");
		const imgData = splitSrc[splitSrc.length - 1];
		return btoa(atob(imgData)) === imgData;
	}
	return false;
}

export function getFileName(file: string) {
	if (file) {
		const fileSplit = file.split(";");
		file = fileSplit.length > 2 ? fileSplit[1] : file;
		return file;
	}
	return file;
}

export function isImageBase64Content(fileName: string) {
	const fNameSplit = fileName ? fileName.split(".") : [];
	return fNameSplit.length > 1 && ImageExtensions.some(extension => fNameSplit[1].toLowerCase() === extension);
};

export function getJustifyContent(hAlignment: string, schema: any, style?: any) {
	let justify = "flex-start"
	if (hAlignment) {
		justify = hAlignment === "right" ? "flex-end" : hAlignment === "center" ? "center" : "flex-start";
	} else if (schema && schema.hAlignment) {
		justify = schema.hAlignment === "right" ? "flex-end" : schema.hAlignment === "center" ? "center" : "flex-start";
	} else if (style && style.justifyContent) {
		justify = style.justifyContent === "right" ? "flex-end" : style.justifyContent === "center" ? "center" : "flex-start";
	}
	return justify
}

export function getAlignItems(vAlignment: string, schema: any, style?: any) {
	let alignItem = "center";
	if (vAlignment) {
		alignItem = vAlignment === "bottom" ? "flex-end" : vAlignment === "top" ? "flex-start" : "center";
	} else if (schema && schema.vAlignment) {
		alignItem = schema.vAlignment === "bottom" ? "flex-end" : schema.vAlignment === "top" ? "flex-start" : "center";
	} else if (style && style.alignSelf) {
		alignItem = style.alignSelf === "bottom" ? "flex-end" : style.alignSelf === "top" ? "flex-start" : "center";
	}
	return alignItem
}