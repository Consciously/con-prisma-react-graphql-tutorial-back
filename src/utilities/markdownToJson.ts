import { Parser, HtmlRenderer, Node } from 'commonmark';
import {
	getFilesFromDirectory,
	readContentFromFile,
	writeFilesToDir,
} from './handleFiles';

type NodeObject = {
	type: string;
	level?: number;
	nodes: Node[];
};

type DataArray = {
	dataArray: {}[];
};

type DataArrayContent = {
	data: {
		name: string;
		messages: string[];
	};
};

const readMarkdownFiles = async (): Promise<Node[]> => {
	const parser = new Parser();

	const markdownFiles = await getFilesFromDirectory('prisma/markdown');

	const markdownContents = await Promise.all(
		markdownFiles.map(async file => {
			const content = await readContentFromFile('prisma/markdown', file);

			return content;
		}),
	);

	return markdownContents.map(markdownContent => {
		const parsed = parser.parse(markdownContent);

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

const convertASTNodesToHtmlElements = async () => {
	const nodes = await readMarkdownFiles();
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

const convertToUnformattedJson = async () => {
	const htmlElementArray = await convertASTNodesToHtmlElements();

	const jsonData: string[] = [];
	htmlElementArray.forEach(htmlElement => {
		const htmlElementJson = JSON.stringify(htmlElement, null, 2);
		jsonData.push(htmlElementJson);
	});

	return jsonData;
};

const convertUnformattedJsonInputToObject = async () => {
	const input = await convertToUnformattedJson();
	const data: { html: string }[] = [];

	for (const element of input) {
		const { html } = JSON.parse(element);

		const object = { html };
		data.push(object);
	}

	const dataUserArray: DataArray = {
		dataArray: [],
	};

	for (const item of data) {
		const html: string = item.html;
		const nameRegex = /name: '(.*?)'/;
		const messagesRegex = /<p>(.*?)<\/p>/g;
		const nameMatch = html.match(nameRegex);
		const messagesMatch = html.match(messagesRegex);
		if (nameMatch && messagesMatch) {
			const name = nameMatch[1];
			const messages = messagesMatch.map(m => m.replace(/<\/?p>/g, ''));

			const dataArrayContent: DataArrayContent = {
				data: {
					name,
					messages,
				},
			};

			dataUserArray.dataArray.push(dataArrayContent);
		}

		await writeFilesToDir(
			'prisma/json/ready',
			'test.json',
			JSON.stringify(dataUserArray, null, 2),
		);
	}
};

convertUnformattedJsonInputToObject();
