const { mathjax } = require("mathjax-full/js/mathjax.js");
const { MathML } = require("mathjax-full/js/input/mathml.js");
const { SVG } = require("mathjax-full/js/output/svg.js");
const { liteAdaptor } = require("mathjax-full/js/adaptors/liteAdaptor.js");
const { RegisterHTMLHandler } = require("mathjax-full/js/handlers/html.js");
const fs = require("fs");

// Read the MathML data from 'input.txt', ensure to use 'utf-8' to get a string
const fileData = fs.readFileSync("input.txt", "utf-8");

// Functions to extract and clean MathML have been kept as is since they're specific to your use case
const extractMathML = (data) => {
	const mathMLRegex = /<math[\s\S]*?<\/math>/g;
	const matches = data.match(mathMLRegex);
	return matches ? matches.map(cleanMathML) : [];
};

const cleanMathML = (mathML) => {
	for (let i = 0; i < mathML.lengh; i++) {
		/**@type {string}*/
		const mathMLString = mathML[i];
		let endOfOpeningTagIdx;
		let startOfClosingTagIdx;
		for (let j = 0; j < mathMLString.length; j++) {
			if (mathMLString[j] === ">") {
				endOfOpeningTagIdx = mathMLString[j];
				break;
			}
		}
		for (let k = 0; k < mathMLString.length; k++) {
			if (mathMLString[mathMLString.length - 1 - k] === "<") {
				startOfClosingTagIdx = mathMLString[mathMLString.length - 1 - k];
				break;
			}
		}
		mathML[i] = mathMLString.substring(
			startOfClosingTagIdx + 1,
			endOfOpeningTagIdx - 1,
		) + "\n";
	}
	return mathML;
};

// Setup MathJax
const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);
const mathml = new MathML();
const svg = new SVG({ fontCache: "none" });
const mathjaxInstance = mathjax.document("", {
	InputJax: mathml,
	OutputJax: svg,
});

// Function to convert MathML to SVG
function convertMathMLToSVG(mathMLString) {
	const math = mathjaxInstance.convert(mathMLString, { display: true });
	return adaptor.outerHTML(math);
}

const fileContentAsString = extractMathML(fileData).join("");
const fileContentWithMathTags = "<math>" + fileContentAsString + "</math>";
const svgOutput = convertMathMLToSVG(fileContentWithMathTags);
fs.writeFileSync("output.svg", svgOutput);
console.log("SVG saved to output.svg");
