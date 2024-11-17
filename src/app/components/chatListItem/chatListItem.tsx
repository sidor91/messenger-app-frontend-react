"use client";

import Image from "next/image";
import { useWebsocket } from "@/lib/useWebsocket";
import { ChatType, UserType } from "@/types/dataTypes";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import Avatar from "../avatar/avatar";
import { truncateString } from "@/lib";

export default function ChatListItem({
	chatData,
	socket,
	currentUser,
}: {
	chatData: ChatType;
	socket: Socket;
	currentUser: UserType;
}) {
	const [chatName, setChatName] = useState("");
	const [lastMessage, setLastMessage] = useState("");
	const [chatAvatar, setChatAvatar] = useState("");
	const { avatar, chat_members, is_group_chat, messages, name, notifications } = chatData;

	useEffect(() => {
		defineChatName();
		getLastMessage();
		getChatAvatar();
		socket.on("message", ({ text, chat_id }) => {
			if (chatData.id === chat_id) {
				setLastMessage(text);
			}
		});
	}, []);

	const defineChatName = () => {
		if (!is_group_chat) {
			const user = chat_members.find(({ id }) => id !== currentUser.id);
			user && setChatName(user?.username);
		} else if (name) {
			setChatName(name);
		} else {
			const membersNameArr = chat_members.map(({ username }) => username);
			setChatName(membersNameArr.join(", "));
		}
	};

	const getLastMessage = () => {
		const sortedMessages = messages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
		sortedMessages.length && setLastMessage(sortedMessages[0].text);
	};

	const getChatAvatar = () => {
		if (!is_group_chat) {
			setChatAvatar(chat_members[0].avatar || "");
		} else {
			setChatAvatar(avatar || "");
		}
	};

	return (
		<li style={{ display: "flex", gap: 10, alignItems: "center" }}>
			{chatAvatar ? (
				<Image src={chatAvatar} alt="avatar" />
			) : is_group_chat ? (
				<Avatar first_name="Group" last_name="Chat" />
			) : (
				<Avatar first_name={chat_members[0].first_name} last_name={chat_members[0].last_name} />
			)}
			<div>
				<div>{chatName}</div>
				<div>{truncateString(lastMessage, 25)}</div>
			</div>
		</li>
	);
}
