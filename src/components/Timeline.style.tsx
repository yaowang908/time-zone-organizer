import styled from 'styled-components';

interface ContainerProps {
  bg?: string;
  txtColor?: string;
}

const Container = styled.div<ContainerProps>`
  ${(props)=> props.bg? `background-color: ${props.bg};` : ''}
  ${(props)=> props.txtColor? `color: ${props.txtColor};` : ''}
`;

interface HolderProps {
  elementWidth?: number;
}

const Holder = styled.div<HolderProps>`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow-x: scroll; 
  height: 25px;
  font-size: 0.8em;
  font-family: Sans-Serif;
  & > div {
    width: ${(props)=> props.elementWidth? `${props.elementWidth}px` : '75px'};
    text-align: center;
    line-height: 25px;
    flex: 1 0 ${(props)=> props.elementWidth? `${props.elementWidth}px` : '75px'};
  }
  &::-webkit-scrollbar {
    height: 0px;
  }
`;

export const Styled = {
  Container,
  Holder
};