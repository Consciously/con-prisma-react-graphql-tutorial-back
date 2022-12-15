import { Parser, HtmlRenderer, Node } from 'commonmark';
import * as fs from 'fs';
import path from 'path';

type NodeObject = {
	type: string;
	level: number;
	nodes: Node[];
};

const readFilesFromSystem = (pathName: string): string[] => {
	const fileDirectory = path.join(process.cwd(), pathName);
	const allFiles = fs.readdirSync(fileDirectory);

	return allFiles.map(file => {
		const fullPath = path.join(fileDirectory, file);

		return fs.readFileSync(fullPath, 'utf-8');
	});
};

const parseMarkdownData = (): Node[] => {
	const markdownFileArray = readFilesFromSystem('/prisma/markdown');

	const parser = new Parser();

	return markdownFileArray.map(markdownFile => {
		const parsed = parser.parse(markdownFile);

		return parsed;
	});
};

const extractMarkdown = () => {
	const nodes = parseMarkdownData();
	const htmlObj = {};
	const objFromAST: NodeObject = {
		type: '',
		level: 0,
		nodes: [],
	};

	nodes.forEach(node => {
		objFromAST.type = node.type;

		if (node.hasOwnProperty('level')) {
			objFromAST.level = node.level;
		}

		const childNodes: Node[] = [];
		let currentChild = node.firstChild;

		while (currentChild !== null) {
			const childObject = currentChild;
			childNodes.push(childObject);
			currentChild = currentChild.next;
		}

		objFromAST.nodes = childNodes;

		objFromAST.nodes.map(objNode => {
			const htmlRenderer = new HtmlRenderer();
			const html = htmlRenderer.render(objNode);

			htmlObj[objNode.type] = html;

			return htmlObj;
		});
	});

	console.log(htmlObj);
};

extractMarkdown();

// const convertToJson = () => {
// 	extractMarkdown();
// };

// convertToJson();
