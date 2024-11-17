"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { mainServer } from "@/lib/axios";
import { navigate } from "@/lib/navigate";

enum Page {
	LOGIN = "/auth/login",
	REGISTER = "/auth/register",
}

export default function AuthForm() {
	const [isLoginPage, setIsLoginPage] = useState(false);
	const [login, setLogin] = useState("");
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const pathName = usePathname();

	useEffect(() => {
		setIsLoginPage(pathName === Page.LOGIN);
	}, [pathName]);

	const handleSubmit = async (e: any) => {
    e.preventDefault();
    const payload = { password };
    Object.assign(payload, isLoginPage ? { login } : { email, username });
    const endpoint = isLoginPage ? Page.LOGIN : Page.REGISTER;

		try {
      const response = await mainServer.axiosInstance.post(endpoint, payload, { withCredentials: true });
			if (response) {
				const { access_token } = response.data.data;
				mainServer.useAuth(access_token);
				navigate(`/chat`);
			}
    } catch (error) {
      console.log(error);
    }
	};

	return (
		<>
			<form
				onSubmit={handleSubmit}
        style={{
          marginTop: 20,
					display: "flex",
					gap: 10,
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					padding: 20,
					border: "1px solid red",
				}}
			>
				{isLoginPage && (
					<div
						style={{
							width: "100%",
							gap: 10,
							display: "flex",
							justifyContent: "space-between",
						}}
					>
						<label htmlFor="login">login</label>
						<input id="login" value={login} onChange={(e) => setLogin(e.target.value)} required />
					</div>
				)}
				{!isLoginPage && (
					<>
						<div
							style={{
								width: "100%",
								gap: 10,
								display: "flex",
								justifyContent: "space-between",
							}}
						>
							<label htmlFor="username">username</label>
							<input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
						</div>
						<div
							style={{
								width: "100%",
								gap: 10,
								display: "flex",
								justifyContent: "space-between",
							}}
						>
							<label htmlFor="email">email</label>
							<input id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
						</div>
					</>
				)}
				<div
					style={{
						width: "100%",
						gap: 10,
						display: "flex",
						justifyContent: "space-between",
					}}
				>
					<label htmlFor="password">password</label>
					<input id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
				</div>
				<button style={{padding: 5, marginLeft: 'auto'}} type="submit">submit</button>
			</form>
		</>
	);
}
