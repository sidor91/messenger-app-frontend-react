import { instances } from "@/constants/instances";
import axios, { AxiosInstance } from "axios";
import { navigate } from "./navigate";

type CrearAxiosInstance = {
	baseUrl: string;
	headers?: { [key: string]: string };
};

class Axios {
	axiosInstance: AxiosInstance;

	constructor(data: CrearAxiosInstance) {
		this.axiosInstance = this.createAxiosInstance(data);
		const access_token = localStorage.getItem("access_token");
		if (access_token) {
			this.useAuth(access_token);
		}
	}

	createAxiosInstance(data: CrearAxiosInstance) {
		const {
			baseUrl,
			headers = {
				"Content-Type": "application/json",
			},
		} = data;
		return axios.create({
			baseURL: baseUrl,
			timeout: 1000,
			headers,
		});
	}

	useAuth(token: string) {
		this.setToken(token);
		this.useResponse();
	}

	setToken(access_token?: string) {
		if (access_token) {
			this.axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
			localStorage.setItem("access_token", access_token);
			return;
		}
		this.axiosInstance.defaults.headers.common["Authorization"] = "";
		localStorage.setItem("access_token", "");
	}

	async refreshToken() {
		try {
			const response = await this.axiosInstance.get("/auth/refresh", {
				withCredentials: true,
			});
			return response.data?.data?.access_token || "";
		} catch (error) {
			console.error("There was an error while refreshing token");
			navigate("/auth/login");
		}
	}

	useResponse() {
		this.axiosInstance.interceptors.response.use(
			(response) => response,
			async (error) => {
				const originalRequest = error.config;
				if (error.response && error.response.status === 401 && !originalRequest._retry) {
					originalRequest._retry = true;
					try {
						const access_token = await this.refreshToken();
						originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
						this.setToken(access_token);
						return this.axiosInstance(originalRequest);
					} catch (err) {
						this.setToken();
						console.error("Error refreshing token", err);
						return Promise.reject(err);
					}
				}
				return Promise.reject(error);
			}
		);
	}
}

export const mainServer = new Axios(instances.mainServer);

