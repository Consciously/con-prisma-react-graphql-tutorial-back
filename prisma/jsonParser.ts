import e from 'express';
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

const getJsonRawData = (): RawUser[] => {
	let result: RawUser[] = [];
	try {
		if (fs.existsSync(jsonDirectory)) {
			const fileNames = fs.readdirSync(jsonDirectory);
			result = fileNames.map(fileName => {
				const fullPath = path.join(jsonDirectory, fileName);
				const fileContents = fs.readFileSync(fullPath, 'utf-8');
				const parsedContents: RawUser = JSON.parse(fileContents);
				return parsedContents;
			});
		} else {
			console.error('No json directory found');
		}
	} catch (error) {
		console.error(error);
	}

	return result;
};

const getJsonData = (): UserData => {
	let result: User[] = [];

	try {
		const userArray = getJsonRawData()[0].dataArray;

		result = userArray.map(({ data }): User => {
			return {
				data: {
					name: data.name,
					messages: {
						create: data.messages,
					},
				},
			};
		});
	} catch (error) {
		console.error(error);
	}

	return result;
};

getJsonData();

export default getJsonData;
