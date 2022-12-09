// src/index.ts
import express from 'express';
import { createYoga } from 'graphql-yoga';
import { schema } from './schema';

const app = express();

const port = Number(process.env.API_PORT) || 4000;

const yoga = createYoga({ schema, logging: 'debug' });

app.use('/graphql', yoga);

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}/graphql`);
});
