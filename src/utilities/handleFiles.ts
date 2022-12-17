import * as fs from 'fs';
import { promisify } from 'util';
import path from 'path';

const readdir = promisify(fs.readdir);
const readFiles = promisify(fs.readFile);
const writeFiles = promisify(fs.writeFile);

// Extract full path

export const getDirectory = (pathSegment: string): string => {
	return path.join(process.cwd(), pathSegment);
};

// Read fileNames from directory

export const getFilesFromDirectory = async (
	pathSegment: string,
): Promise<string[]> => {
	const directory = getDirectory(pathSegment);
	if (fs.existsSync(directory)) {
		return Promise.all(await readdir(directory));
	} else {
		throw new Error('No json directory found');
	}
};

// Read files from directory

export const readContentFromFile = async (
	pathSegment: string,
	file: string,
): Promise<string> => {
	const directory = getDirectory(pathSegment);
	return readFiles(`${directory}/${file}`, 'utf-8');
};

// write files to directory

export const writeFilesToDir = () => {};
