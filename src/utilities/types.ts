export type RawUser = {
	dataArray: {
		data: {
			name: string;
			messages: string[];
		};
	}[];
};

export type RawUserArray = RawUser[];

export type User = {
	data: {
		name: string;
		messages: {
			create: {
				body: string;
			}[];
		};
	};
};

export type UserArray = User[];
