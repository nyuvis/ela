import React from "react";
import styled from "styled-components";
import DeleteIcon from "react-icons/lib/fa/trash-o";
import { Spin } from "antd";

export const Title = styled.div`
    font-size: ${({ theme }) => theme.sizes.fontTitle}em;
    padding-bottom: ${({ theme }) => theme.sizes.padding}px;
`;

export const SubTitle = styled.div`
    color: ${({ theme, primary }) => primary && theme.colors.primary};
    font-size: ${({ theme }) => theme.sizes.fontSubTitle}em;
    padding-bottom: ${({ theme }) => theme.sizes.padding}px;
`;

export const SelectList = styled.div`
    border: solid 1px ${({ theme }) => theme.colors.border};
`;

const RemoveIcon = styled.button`
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translate(0%, -55%);
    border: none;
    outline: none;
    background-color: transparent;
    display: none;
    cursor: pointer;
    font-size: 1.3em;
    &:hover {
        color: ${({ theme }) => theme.colors.remove};
    }
`;

export const SelectListItemBase = styled.div`
    position: relative;
    text-align: left;
    padding: ${({ theme }) => theme.sizes.padding}px;
    background-color: ${({ selected, theme }) =>
        selected && theme.colors.primary};
    color: ${({ selected, theme }) => (selected ? "white" : theme.colors.text)};
    font-size: 1.1em;
    &:hover {
        cursor: pointer;
        color: ${({ theme, selected }) => !selected && theme.colors.text};
        background-color: ${({ theme, selected }) =>
            !selected && theme.colors.secondaryBackground};
    }
    &:hover > button {
        display: block;
    }
`;

export const LoadingContainer = styled.div`
    position: absolute;
    z-index: 200;
    text-align: center;
    top: 0px;
    bottom: 0px;
    left: 0px;
    text-align: center;
    flex-direction: column;
    font-size: 2em;
    right: 0px;
    background-color: rgba(255, 255, 255, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const Loading = props => {
    return (
        <LoadingContainer>
            <Spin />Loading...
        </LoadingContainer>
    );
};

export const Menu = styled.div`
    background-color: ${({ theme }) => theme.colors.background};
    box-shadow: 0px 5px 10px #ccc;
    min-width: 100px;
`;

export const MenuItem = styled.div`
    padding: ${({ theme }) => theme.sizes.padding / 2}px;
    padding-left: ${({ theme }) => theme.sizes.padding}px;
    padding-right: ${({ theme }) => theme.sizes.padding}px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: left;
    transition: background-color 0.1s ease-out;
    &:hover {
        background-color: ${({ theme }) => theme.colors.primary};
        color: white;
    }
    & > label {
        margin-left: 10px;
    }
`;

export const Divider = styled.div`
    height: 1px;
    background-color: ${({ theme }) => theme.colors.border};
`;

export const SelectListItem = props => {
    const { onRemove, ...ownProps } = props;
    if (onRemove) {
        const { children, ...removeOwnProps } = ownProps;

        return (
            <SelectListItemBase {...removeOwnProps}>
                {children}
                <RemoveIcon>
                    <DeleteIcon
                        onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            onRemove();
                        }}
                    />
                </RemoveIcon>
            </SelectListItemBase>
        );
    }
    return <SelectListItemBase {...ownProps} />;
};
