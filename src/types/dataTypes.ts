type CommonDataType = {
	id: string;
	created_at: Date;
	updated_at: Date;
};

export type UserType = CommonDataType & {
	avatar: string | null;
	email: string;
	first_name: string;
	is_online: boolean;
	last_name: string;
	phone: string;
	username: string;
};

export type NotificationType = CommonDataType & {
	recipient: UserType[];
	type: string;
};

export type MessageType = CommonDataType & {
	is_edited: boolean;
  text: string;
  sender: string;
};

export type ChatType = CommonDataType & {
	avatar: null | string;
	chat_members: UserType[];
	is_group_chat: boolean;
	messages: MessageType[];
	name: string | null;
	notifications: Notification[];
};
