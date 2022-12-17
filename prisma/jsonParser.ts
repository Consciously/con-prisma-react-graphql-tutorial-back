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

type RawUserArray = RawUser[];

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

const getJsonRawData = async (): Promise<RawUserArray | undefined> => {
	try {
		const allFiles = await getFilesFromDirectory('prisma/json');

		return await Promise.all(
			allFiles.map(async file => {
				const content: RawUser = JSON.parse(
					await readContentFromFile('prisma/json', file),
				);

				return content;
			}),
		);
	} catch (error) {
		console.error(error);
		return [];
	}
};

const getJsonUserData = async (): Promise<UserData | undefined> => {
	try {
		const jsonRawData = await getJsonRawData();

		if (Array.isArray(jsonRawData) && jsonRawData.length > 0) {
			const dataArray = jsonRawData[0].dataArray;

			if (Array.isArray(dataArray)) {
				return Promise.all(
					jsonRawData[0].dataArray.map(async ({ data }): Promise<User> => {
						return {
							data: {
								name: data.name,
								messages: {
									create: data.messages.map(message => ({ body: message })),
								},
							},
						};
					}),
				);
			}
		}
	} catch (error) {
		console.error(error);
		return [];
	}
};

export default getJsonUserData;
