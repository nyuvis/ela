import React from "react";
import styled from "styled-components";

const IconContainer = styled.g`
    cursor: pointer;
    &:hover {
        fill: ${({ theme }) => theme.colors.primary};
    }
`;

export const TrashCanIcon = ({ scale = 1, fill = "#ccc", ...rest }) => (
    <IconContainer transform={`scale(${scale})`} fill={fill} {...rest}>
        <rect width="24" height="24" fill="white" className="background-rect" />
        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
        <path d="M0 0h24v24H0z" fill="none" />
    </IconContainer>
);

export const CheckIcon = ({ scale = 1, fill = "#ccc", ...rest }) => (
    <IconContainer transform={`scale(${scale})`} fill={fill} {...rest}>
        <rect width="24" height="24" fill="white" className="background-rect" />
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
    </IconContainer>
);

export const BlockIcon = ({ scale = 1, fill = "#ccc", ...rest }) => (
    <IconContainer transform={`scale(${scale})`} fill={fill} {...rest}>
        <rect width="24" height="24" fill="white" className="background-rect" />
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z" />
    </IconContainer>
);

export const PencilIcon = ({ scale = 1, fill = "#ccc", ...rest }) => (
    <IconContainer transform={`scale(${scale})`} fill={fill} {...rest}>
        <rect width="24" height="24" fill="white" className="background-rect" />
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
        <path d="M0 0h24v24H0z" fill="none" />
    </IconContainer>
);

export const SearchIcon = ({ scale = 1, fill = "#ccc", ...rest }) => (
    <IconContainer transform={`scale(${scale})`} fill={fill} {...rest}>
        <rect width="24" height="24" fill="white" className="background-rect" />
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        <path d="M0 0h24v24H0z" fill="none" />
    </IconContainer>
);
