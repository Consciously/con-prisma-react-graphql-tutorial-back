import { PrismaClient } from '@prisma/client';
import getJsonData from './jsonParser';

const prisma = new PrismaClient();

const updateDb = async (): Promise<void> => {
	try {
		const users = getJsonData();

		const createUserPromises = users.map(user => prisma.user.create(user));
		await Promise.all(createUserPromises);
	} catch (error) {
		console.error(error);
	}
};

updateDb();
