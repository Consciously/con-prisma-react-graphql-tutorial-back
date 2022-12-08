// src/index.ts
import http from 'http';
import { createYoga } from 'graphql-yoga';
import { schema } from './schema';

const port = Number(process.env.API_PORT) || 4000;

const yoga = createYoga({ schema });

const server = http.createServer(yoga);

server.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}/graphql`);
});
