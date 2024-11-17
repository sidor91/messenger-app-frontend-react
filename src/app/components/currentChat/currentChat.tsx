'use client';

import { useEffect, useState } from "react";
import Message from "../message/message";
import { mainServer } from "@/lib/axios";
import { Socket } from "socket.io-client";
import { ChatType, MessageType } from "@/types/dataTypes";

export default function CurrentChat({ chat, socket, isSocketConnected }: { chat: ChatType; socket: Socket; isSocketConnected: boolean }) {
	const [messages, setMessages] = useState<MessageType[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
   const { messages: originalMessages } = chat;
		const reverseMessages = originalMessages.slice().reverse();
		setMessages(reverseMessages);
  }, [chat]);
   
  useEffect(() => {
    if (isSocketConnected) {
      socket.on("message", (message) => setMessages((prevMessages) => [...prevMessages, message]));
    }
  },[isSocketConnected])

  const sendMessage = (e: any) => {
    e.preventDefault();
    socket.emit("message", { text: currentMessage, chat_id: chat.id, recipients: chat.chat_members });
    setCurrentMessage('');
	};

	return (
		<div
			style={{ margin: 20, border: "1px solid red", display: "flex", flexDirection: "column", justifyContent: "end" }}
		>
			<ul style={{ listStyle: "none" }}>
				{chat &&
					messages.map(({ text, sender, id }) => (
						<li key={id}>
							<Message text={text} sender={sender} />
						</li>
					))}
			</ul>
			<form style={{ display: "flex" }} onSubmit={sendMessage}>
				<input type="text" onChange={(e) => setCurrentMessage(e.target.value)} />
				<button type="submit">Send</button>
			</form>
		</div>
	);
}
