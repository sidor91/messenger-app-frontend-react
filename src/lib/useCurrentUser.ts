import { useEffect, useState } from "react";
import { mainServer } from "./axios";
import { User } from "@/types/dataTypes";

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
	const access_token = localStorage.getItem("access_token");

	useEffect(() => {
		if (access_token) {
			(async () => {
				try {
					const response = await mainServer.axiosInstance.get("/user/current");
					const { data: userData } = response.data;
					setCurrentUser(userData);
				} catch (error) {
					console.log("There was an error getting current user", error);
				}
			})();
		}
	}, []);

	return currentUser;
};
