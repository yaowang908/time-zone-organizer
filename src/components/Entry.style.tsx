import styled from 'styled-components';

interface ContainerProps {

};

const Container = styled.div<ContainerProps>`
  position: relative;
`;

interface HeaderProps {
  bg?: string;
  txtColor?: string;
};

const Header = styled.div<HeaderProps>`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  padding:0 1em 0.5em 1em;
  ${(props)=> props.bg? `background-color: ${props.bg};` : ''}
  ${(props)=> props.txtColor? `color: ${props.txtColor};` : ''}
`;

interface FooterProps {
  bg?: string;
  txtColor?: string;
};
// footer is just a container, date element is controlled by in-line css
const Footer = styled.div<FooterProps>`
  padding-top: 1em;
  font-size: 0.6em;
  ${(props)=> props.bg? `background-color: ${props.bg};` : ''}
  ${(props)=> props.txtColor? `color: ${props.txtColor};` : ''} 
`;

export const Styled = {
  Container,
  Header,
  Footer
};