import Link from "next/link";

export default function Home() {
  return (
		<main
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				gap: 20,
				paddingTop: 50,
			}}
		>
			<div>Welcome to messanger app</div>
			<div>
				<span>Please either login or register to proceed</span>
			</div>
			<div style={{ display: "flex", gap: 20 }}>
				<Link href="/auth/login">Login</Link>
				<Link href="/auth/register">Register</Link>
			</div>
		</main>
	);
}
