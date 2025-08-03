import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/Button';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 5rem 2rem;
  min-height: 60vh;
`;

const NotFoundTitle = styled.h1`
  font-size: 8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
  line-height: 1;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 6rem;
  }
`;

const NotFoundSubtitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.5rem;
  }
`;

const NotFoundText = styled.p`
  font-size: 1.25rem;
  max-width: 600px;
  margin-bottom: 2.5rem;
  color: ${({ theme }) => theme.colors.lightText};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.125rem;
  }
`;

const NotFoundPage: React.FC = () => {
  return (
    <NotFoundContainer>
      <NotFoundTitle>404</NotFoundTitle>
      <NotFoundSubtitle>Page Not Found</NotFoundSubtitle>
      <NotFoundText>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </NotFoundText>
      <Button as={Link} to="/" size="large">
        Return to Home
      </Button>
    </NotFoundContainer>
  );
};

export default NotFoundPage;