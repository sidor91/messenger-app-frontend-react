"use client";
import { ChatType, UserType } from "@/types/dataTypes";
import { Dispatch, MouseEvent, SetStateAction, useEffect, useState } from "react";
import { mainServer } from "@/lib/axios";
import ChatListItem from "../chatListItem/chatListItem";
import { Socket } from "socket.io-client";
import Modal from "../modal/modal";
import NewChatForm from "../newChatForm/newChatForm";

export default function ChatList({
	currentUser,
	socket,
	setCurrentChat,
	chats,
}: {
	currentUser: UserType;
	socket: Socket;
	setCurrentChat: Dispatch<SetStateAction<ChatType | null>>;
	chats: ChatType[];
}) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const closeModal = () => {
		setIsModalOpen(false);
  };

	return (
		<div style={{ margin: 20, border: "1px solid red", paddingTop: 10, paddingBottom: 10 }}>
			<button style={{ marginBottom: 10 }} type="button" onClick={() => setIsModalOpen(true)}>
				New chat
			</button>
			{isModalOpen && (
				<Modal onClose={closeModal}>
					<NewChatForm currentUser={currentUser} socket={socket} closeModal={closeModal} />
				</Modal>
			)}
			<ul id="chat_list">
				{chats.map((chat) => (
					<div
						style={{ border: "1px solid red", marginBottom: 5, cursor: "pointer" }}
						key={chat.id}
						onClick={() => {
							setCurrentChat(chat);
						}}
					>
						<ChatListItem chatData={chat} socket={socket} currentUser={currentUser} />
					</div>
				))}
			</ul>
		</div>
	);
}
