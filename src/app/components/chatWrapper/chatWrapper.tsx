"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Socket } from "socket.io-client";
import { useWebsocket } from "@/lib/useWebsocket";
import { navigate } from "@/lib/navigate";
import CurrentChat from "../currentChat/currentChat";
import ChatList from "../chatList/chatList";
import { mainServer } from "@/lib/axios";
import { ChatType, UserType } from "@/types/dataTypes";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { instances } from "@/constants/instances";

export default function ChatWrapper() {
	const [chats, setChats] = useState<ChatType[]>([]);
	const [currentChat, setCurrentChat] = useState<ChatType | null>(null);
	const currentUser = useCurrentUser();
  const { socket, isConnected: isSocketConnected } = useWebsocket();
  
  useEffect(() => {
		if (socket && isSocketConnected) {
      socket.emit("get-chats", "", (chatsData: ChatType[]) => {
         setChats(chatsData);
      });
			socket.on("new-chat", (chat) => {
				if (!chat) {
					alert("The chat with such combination of users is already exist");
					return;
				}
				setChats((prevChats) => (prevChats ? [...prevChats, chat] : [chat]));
			});
      // socket.on("message", (message) => {
      //   if (currentChat) {
      //     const chatCopy = {...currentChat};
      //     chatCopy.messages.push(message);
      //     setCurrentChat(currentChat)
      //   }
      // });
		}
  }, [isSocketConnected]);
  
  // useEffect(() => {
  //   console.log('currentChat', currentChat);
  // },[currentChat])

	return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			<div>
				<h3 style={{ textAlign: "center" }}>Messanger App</h3>
			</div>
			<div style={{ display: "flex" }}>
				{currentUser && isSocketConnected && (
					<ChatList
						currentUser={currentUser}
						socket={socket as Socket}
						setCurrentChat={setCurrentChat}
						chats={chats}
					/>
				)}
				{currentChat && (
					<CurrentChat isSocketConnected={isSocketConnected} chat={currentChat} socket={socket as Socket} />
				)}
			</div>
		</div>
	);
}
