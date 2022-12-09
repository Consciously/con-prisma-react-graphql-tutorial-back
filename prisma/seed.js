"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    // Delete all `User` and `Message` records
    yield prisma.message.deleteMany({});
    yield prisma.user.deleteMany({});
    // (Re-)Create dummy `User` and `Message` records
    yield prisma.user.create({
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
    yield prisma.user.create({
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
    yield prisma.user.create({
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
});
main().then(() => {
    console.log('Data seeded...');
});
