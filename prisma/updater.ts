import { PrismaClient } from '@prisma/client';
import getJsonData from './jsonParser';

const prisma = new PrismaClient();

const updateDb = async (): Promise<void> => {
	const users = getJsonData();

	for (const user of users) {
		await prisma.user.create(user);
	}
};

updateDb();
