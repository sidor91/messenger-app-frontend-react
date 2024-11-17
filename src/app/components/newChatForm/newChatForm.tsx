'use client';

import { mainServer } from "@/lib/axios";
import { ChatType, UserType } from "@/types/dataTypes";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Socket } from "socket.io-client";

export default function NewChatForm({
	currentUser,
	socket,
	closeModal,
}: {
	currentUser: UserType;
	socket: Socket;
	closeModal: () => void;
}) {
	const [allUsers, setAllUsers] = useState<UserType[] | null>(null);
	const [chatMembers, setChatMembers] = useState<UserType[]>([currentUser]);
	const [chatName, setChatName] = useState("");
	const [message, setMessage] = useState("");

	useEffect(() => {
		if (!allUsers) {
			getAllUsers();
		}
	}, [allUsers]);

	const getAllUsers = async () => {
		try {
			const response = await mainServer.axiosInstance.get("/user/all");
			setAllUsers(response.data);
		} catch (error) {
			console.log(error);
		}
	};

	const handleCheckboxChange = (user: UserType) => {
		if (!chatMembers.includes(user)) {
			setChatMembers((prevChatMembers) => [...prevChatMembers, user]);
		} else {
			setChatMembers((prevChatMembers) => prevChatMembers.filter((currentUser) => currentUser !== user));
		}
	};

	const handleSubmit = async (e: any) => {
    e.preventDefault();
		socket.emit("new-chat", { chat_members: chatMembers, name: chatName });
		closeModal();
	};

	return (
		<form action="" style={{ display: "flex", flexDirection: "column", gap: 10 }} onSubmit={handleSubmit}>
			{allUsers &&
				allUsers.length > 0 &&
				allUsers.map(
					(user) =>
						user.id !== currentUser.id && (
							<div
								key={user.id}
								style={{
									gap: 10,
									display: "flex",
								}}
							>
								<input id={user.id} type="checkbox" value={user.id} onChange={() => handleCheckboxChange(user)} />
								<label htmlFor={user.id}>{`${user.first_name} ${user.last_name}`}</label>
							</div>
						)
				)}
			<div>
				<label htmlFor="name">Chat Name</label>
				<input type="text" id="name" onChange={(e) => setChatName(e.target.value)} />
			</div>
			<div>
				<label htmlFor="message">Message</label>
				<input type="text" id="message" onChange={(e) => setMessage(e.target.value)} />
			</div>
			<button style={{ marginLeft: "auto" }} type="submit">
				New chat
			</button>
		</form>
	);
} 