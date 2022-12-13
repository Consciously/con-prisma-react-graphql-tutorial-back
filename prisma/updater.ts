import { PrismaClient } from '@prisma/client';
import getJsonData from './jsonParser';

const prisma = new PrismaClient();

const updateDb = (): void => {
	getJsonData().map(async content => {
		// const { data } = content;

		await prisma.user.create(content);
	});
};

updateDb();
