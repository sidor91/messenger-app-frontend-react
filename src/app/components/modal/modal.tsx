import React, { ReactNode } from "react";
import { CloseButton, ModalContainer, Overlay } from "./modal.styled";

type ModalProps = {
	children: ReactNode;
	onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
	const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	return (
		<Overlay onClick={handleOverlayClick}>
			<ModalContainer>
				<CloseButton onClick={onClose}>&times;</CloseButton>
				{children}
			</ModalContainer>
		</Overlay>
	);
};

export default Modal;
