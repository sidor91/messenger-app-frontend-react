export default function Message({ text, sender }: { text: string; sender: string }) {
	return (
		<>
			<div>{sender}</div>
			<div>{text}</div>
		</>
	);
}