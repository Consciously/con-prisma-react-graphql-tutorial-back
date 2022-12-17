import {
	getFilesFromDirectory,
	readContentFromFile,
} from '../src/utilities/handleFiles';

type RawUser = {
	dataArray: {
		data: {
			name: string;
			messages: string[];
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

const getJsonRawData = async (): Promise<RawUser[] | undefined> => {
	try {
		const allFiles = await getFilesFromDirectory('prisma/json');

		return Promise.all(
			allFiles.map(async file => {
				const content: RawUser = JSON.parse(
					await readContentFromFile('prisma/json', file),
				);

				return content;
			}),
		);
	} catch (error) {
		console.error(error);
		return undefined;
	}

	// return result;
};

const getJsonUserData = async (): Promise<UserData | undefined> => {
	try {
		const jsonRawData = await getJsonRawData();

		if (typeof jsonRawData !== 'undefined') {
			return await Promise.all(
				jsonRawData.map(async ({ dataArray }): Promise<User> => {
					return dataArray as unknown as User;
				}),
			);
		}
	} catch (error) {
		console.error(error);
		return undefined;
	}
};

getJsonUserData().then(data => {
	data && console.log(data[0]);
});

export default getJsonUserData;
