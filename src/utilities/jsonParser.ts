import { getFilesFromDirectory, readContentFromFile } from './handleFiles';
import { RawUser, RawUserArray, User, UserArray } from './types';

const getJsonRawData = async (): Promise<RawUserArray | undefined> => {
	try {
		const jsonFiles = await getFilesFromDirectory('prisma/json/ready');

		return await Promise.all(
			jsonFiles.map(async file => {
				const content = JSON.parse(
					await readContentFromFile('prisma/json/ready', file),
				);

				return content as RawUser;
			}),
		);
	} catch (error) {
		console.error(error);
	}
};

const getJsonUserData = async (): Promise<UserArray | undefined> => {
	try {
		const jsonRawData = await getJsonRawData();

		if (typeof jsonRawData !== 'undefined') {
			const dataArray = jsonRawData[0].dataArray;

			return Promise.all(
				dataArray.map(async ({ data }): Promise<User> => {
					console.log(data);
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
