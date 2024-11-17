import { AvatarWrapper } from "./avatar.styled";

const Avatar = ({ first_name, last_name }: { first_name: string; last_name: string }) => {
	 const initials = `${first_name[0].toUpperCase()}${last_name[0].toUpperCase()}`;
	return <AvatarWrapper>{initials}</AvatarWrapper>;
};

export default Avatar;
