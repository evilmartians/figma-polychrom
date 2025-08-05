export const styleObjectToCssString = (styleObject: Record<string, string>): string => {
	let cssString = '';
	for (const property in styleObject) {
		if (Object.prototype.hasOwnProperty.call(styleObject, property)) {
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			cssString += `${property}: ${styleObject[property]}; `;
		}
	}
	return cssString.trim();
};
