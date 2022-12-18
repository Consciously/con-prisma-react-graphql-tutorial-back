import { Parser, HtmlRenderer, Node } from 'commonmark';
import * as fs from 'fs';
import path from 'path';

interface NodeObject {
	type: string;
	level?: number;
	nodes: Node[];
}

const readFilesFromSystem = (pathName: string): string[] => {
	const fileDirectory = path.join(process.cwd(), pathName);
	const allFiles = fs.readdirSync(fileDirectory);

	return allFiles.map(file => {
		const fullPath = path.join(fileDirectory, file);

		return fs.readFileSync(fullPath, 'utf-8');
	});
};

const readMarkdownFiles = () => {
	const markdownFileArray = readFilesFromSystem('prisma/markdown');

	const parser = new Parser();

	return markdownFileArray.map(markdownFile => {
		const parsed = parser.parse(markdownFile);

		return parsed;
	});
};

const createNodeObject = (node: Node): NodeObject => {
	const obj: NodeObject = {
		type: node.type,
		nodes: [],
	};

	obj.level = node.level;

	let currentChild = node.firstChild;
	while (currentChild !== null) {
		const childObject: Node = currentChild;
		obj.nodes.push(childObject);
		currentChild = currentChild.next;
	}
	return obj;
};

const convertASTObjectToHtmlObject = () => {
	const nodes = readMarkdownFiles();
	const htmlObjArray: {}[] = [];

	nodes.forEach(node => {
		const objFromAST = createNodeObject(node);

		const htmlRenderer = new HtmlRenderer();
		const html = objFromAST.nodes.reduce((htmlString, objNode) => {
			return htmlString + htmlRenderer.render(objNode);
		}, '');

		const htmlObj = { html };
		htmlObjArray.push(htmlObj);
	});

	return htmlObjArray;
};

const convertToJson = () => {
	const htmlDataArray = convertASTObjectToHtmlObject();

	// Create a new array for each iteration of the loop
	const jsonData: string[] = [];
	htmlDataArray.forEach((htmlData, index) => {
		const htmlDataString = JSON.stringify(htmlData, null, 2);
		jsonData.push(htmlDataString);
	});

	// Combine all the arrays into a single array
	const combinedJsonData = jsonData;
	const jsonString = JSON.stringify(combinedJsonData, null, 2);
	fs.writeFileSync('./prisma/json/htmlData.json', jsonString);
};

convertToJson();
