import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: #1a1a1a;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
`;

const Logo = styled.h1`
  font-size: 1.8rem;
  font-weight: 800;
  color: #ff4081;
  margin: 0;
  cursor: pointer;
`;

const Nav = styled.nav`
  display: flex;
  gap: 25px;
`;

const LinkItem = styled.a`
  color: #ffffff;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
  
  &:hover {
    color: #ff4081;
    transition: 0.3s ease;
  }
`;

export default function Header() {
  return (
    <HeaderContainer>
      <Logo>POA Dance Festival</Logo>
      <Nav>
        <LinkItem href="#">Home</LinkItem>
        <LinkItem href="#">Programação</LinkItem>
        <LinkItem href="#">Matrícula</LinkItem>
      </Nav>
    </HeaderContainer>
  );
}