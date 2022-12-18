import { PrismaClient } from '@prisma/client';
import getJsonUserData from './jsonParser';

const prisma = new PrismaClient();

const updateDb = async (): Promise<void> => {
	try {
		const users = await getJsonUserData();
		if (typeof users !== 'undefined') {
			for (const user of users) {
				await prisma.user.create(user);
			}
		}
	} catch (error) {
		console.error(error);
	}
};

updateDb();
