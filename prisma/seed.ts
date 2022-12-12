import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const main = async () => {
	// Delete all `User` and `Message` records
	await prisma.message.deleteMany({});
	await prisma.user.deleteMany({});
	// (Re-)Create dummy `User` and `Message` records
	await prisma.user.create({
		data: {
			name: 'Jack',
			messages: {
				create: [
					{
						body: 'A Note for Jack',
					},
					{
						body: 'Another note for Jack',
					},
				],
			},
		},
	});
	await prisma.user.create({
		data: {
			name: 'Ryan',
			messages: {
				create: [
					{
						body: 'A Note for Ryan',
					},
					{
						body: 'Another note for Ryan',
					},
				],
			},
		},
	});
	await prisma.user.create({
		data: {
			name: 'Adam',
			messages: {
				create: [
					{
						body: 'A Note for Adam',
					},
					{
						body: 'Another note for Adam',
					},
				],
			},
		},
	});
	await prisma.user.create({
		data: {
			name: 'Sam',
			messages: {
				create: [
					{
						body: 'A Note for Sam',
					},
					{
						body: 'Another note for Sam',
					},
				],
			},
		},
	});
};

main().then(() => {
	console.log('Data seeded...');
});
