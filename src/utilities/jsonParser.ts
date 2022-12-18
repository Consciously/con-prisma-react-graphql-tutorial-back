import { getFilesFromDirectory, readContentFromFile } from './handleFiles';

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
		const jsonFiles = await getFilesFromDirectory('prisma/json');

		return await Promise.all(
			jsonFiles.map(async file => {
				const content = JSON.parse(
					await readContentFromFile('prisma/json', file),
				);

				return content as RawUser;
			}),
		);
	} catch (error) {
		console.error(error);
	}
};

const getJsonUserData = async (): Promise<UserData | undefined> => {
	try {
		const jsonRawData = await getJsonRawData();

		if (typeof jsonRawData !== 'undefined') {
			const dataArray = jsonRawData[0].dataArray;

			return Promise.all(
				dataArray.map(async ({ data }): Promise<User> => {
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
	} catch (error) {
		console.error(error);
	}
};

export default getJsonUserData;
