import { Socket, io } from "socket.io-client";
import { mainServer } from "./axios";
import { useCallback, useEffect, useState } from "react";

export const useWebsocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState<boolean>(false);

	 useEffect(() => {
			const access_token = localStorage.getItem("access_token");
			if (access_token) {
				connectSocket(access_token);
			}

			return () => {
				disconnect();
			};
   }, []);
  
  useEffect(() => {
		if (socket) {
			socket.on("connect", () => {
				handleConnect();
			});
			socket.on("disconnect", () => {
				handleDisconnect();
			});
      socket.on("tokenExpired", handleTokenExpired);
      
       return () => {
					socket.off("connect", handleConnect);
					socket.off("disconnect", handleDisconnect);
					socket.off("tokenExpired", handleTokenExpired);
				};
		}
  }, [socket]);
  
   const handleConnect = useCallback(() => {
			setIsConnected(true);
		}, []);

		const handleDisconnect = useCallback(() => {
			setIsConnected(false);
		}, []);

	const handleTokenExpired = async () => {
		try {
			const new_access_token = await mainServer.refreshToken();
			mainServer.useAuth(new_access_token);
			connectSocket(new_access_token);
		} catch (error) {
			console.error("There was an error while refreshing token");
		}
	};

	const connectSocket = (token: string) => {
		try {
			const newSocket = io(process.env.NEXT_PUBLIC_SERVER_BASE_URL as string, {
				auth: {
					token: `Bearer ${token}`,
				},
			});

			setSocket(newSocket);
		} catch (error) {
			console.error("Error while trying to connect socket", error);
		}
	};


const disconnect = () => {
	if (socket) {
		socket.disconnect();
		setSocket(null);
	}
};
  
  return { socket, isConnected, disconnect };
};
