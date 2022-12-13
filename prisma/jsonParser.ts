import fs from 'fs';
import path from 'path';

type RawUser = {
	dataArray: {
		data: {
			name: string;
			messages: {
				body: string;
			}[];
		};
	}[];
};

type User = {
	data: {
		name: string;
		messages: {
			create: {
				body: string;
			}[];
		};
	};
};

type UserData = User[];

const jsonDirectory = path.join(process.cwd(), 'prisma/json');

const getJsonRawData = () => {
	const fileNames = fs.readdirSync(jsonDirectory);

	return fileNames.flatMap(fileName => {
		const fullPath = path.join(jsonDirectory, fileName);
		const fileContents = fs.readFileSync(fullPath, 'utf-8');

		const parsedContents: RawUser = JSON.parse(fileContents);

		return parsedContents;
	});
};

const getJsonData = (): UserData => {
	const userArray = getJsonRawData()[0].dataArray;

	return userArray.map(({ data }): User => {
		return {
			data: {
				name: data.name,
				messages: {
					create: data.messages,
				},
			},
		};
	});
};

export default getJsonData;
