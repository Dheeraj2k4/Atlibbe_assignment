import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const HeaderContainer = styled.header`
  background-color: #fff;
  box-shadow: ${({ theme }) => theme.shadows.small};
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 1rem;
  }
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    width: 2rem;
    height: 2rem;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    gap: 1rem;
  }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  color: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.text)};
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  padding: 0.5rem 0;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: ${({ $active }) => ($active ? '100%' : '0')};
    height: 2px;
    background-color: ${({ theme }) => theme.colors.primary};
    transition: width ${({ theme }) => theme.transitions.default};
  }

  &:hover:after {
    width: 100%;
  }
`;

const AuthContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const LoginButton = styled(Link)`
  padding: 0.5rem 1rem;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}1a;
  }
`;

const SignupButton = styled(Link)`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.borderRadius.default};
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}e6;
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  
  .user-greeting {
    font-weight: 500;
  }
  
  .dropdown-content {
    display: none;
    position: absolute;
    top: 100%;
    right: 0;
    background-color: white;
    min-width: 160px;
    box-shadow: ${({ theme }) => theme.shadows.medium};
    border-radius: ${({ theme }) => theme.borderRadius.default};
    padding: 0.5rem 0;
    z-index: 10;
  }
  
  &:hover .dropdown-content {
    display: block;
  }
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 0.5rem 1rem;
  color: ${({ theme }) => theme.colors.text};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.lightBg};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const LogoutButton = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  font-size: 1rem;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.lightBg};
    color: ${({ theme }) => theme.colors.error};
  }
`;

const Header: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
          Product Transparency Portal
        </Logo>
        <Nav>
          <NavLink to="/" $active={location.pathname === '/'}>
            Home
          </NavLink>
          <NavLink to="/submit" $active={location.pathname === '/submit'}>
            Submit Product
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/reports" $active={location.pathname === '/reports'}>
              Reports
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" $active={location.pathname.startsWith('/admin')}>
              Admin
            </NavLink>
          )}
        </Nav>
        
        {isAuthenticated ? (
          <UserMenu>
            <span className="user-greeting">Hello, {user?.name}</span>
            <div className="dropdown-content">
              <DropdownItem to="/profile">Profile</DropdownItem>
              <DropdownItem to="/reports">My Reports</DropdownItem>
              {isAdmin && (
                <DropdownItem to="/admin/users">Manage Users</DropdownItem>
              )}
              <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
            </div>
          </UserMenu>
        ) : (
          <AuthContainer>
            <LoginButton to="/login">Login</LoginButton>
            <SignupButton to="/register">Sign Up</SignupButton>
          </AuthContainer>
        )}
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;