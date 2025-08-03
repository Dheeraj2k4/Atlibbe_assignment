import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/Button';

const HeroSection = styled.section`
  padding: 6rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 4rem 0;
  }
`;

const HeroContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 1rem;
  }
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.primary};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  max-width: 800px;
  margin: 0 auto 2.5rem;
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.125rem;
  }
`;

const FeaturesSection = styled.section`
  padding: 5rem 0;
  background-color: white;
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 1rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  color: ${({ theme }) => theme.colors.primary};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled.div`
  background-color: ${({ theme }) => theme.colors.lightBg};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.small};
  transition: transform ${({ theme }) => theme.transitions.default};

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const FeatureIcon = styled.div`
  width: 4rem;
  height: 4rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.primary};
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.6;
`;

const CTASection = styled.section`
  padding: 5rem 0;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  text-align: center;
`;

const CTAContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 1rem;
  }
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 2rem;
  }
`;

const CTADescription = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.125rem;
  }
`;

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <HeroSection>
        <HeroContainer>
          <HeroTitle>Product Transparency Portal</HeroTitle>
          <HeroSubtitle>
            Empowering consumers with comprehensive product information and promoting transparency, 
            trust, and health-first product decisions.
          </HeroSubtitle>
          <center><Button size="large" onClick={() => navigate('/submit')}>
            Submit Your Product
          </Button></center>
        </HeroContainer>
      </HeroSection>

      <FeaturesSection>
        <FeaturesContainer>
          <SectionTitle>Why Choose Our Platform?</SectionTitle>
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </FeatureIcon>
              <FeatureTitle>Transparency</FeatureTitle>
              <FeatureDescription>
                We believe in full disclosure. Our platform helps companies share detailed information about their products, 
                ingredients, manufacturing processes, and more.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
              </FeatureIcon>
              <FeatureTitle>Trust</FeatureTitle>
              <FeatureDescription>
                Build consumer trust through verified information and comprehensive reporting. 
                Our transparency reports help establish credibility and foster long-term relationships.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4c0 1.66-1.34 3-3 3s-3-1.34-3-3H4V5h14v9z" />
                </svg>
              </FeatureIcon>
              <FeatureTitle>Health-First</FeatureTitle>
              <FeatureDescription>
                We prioritize health and well-being in all aspects of our platform. 
                Our intelligent questioning system helps highlight the health impacts of products.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </FeaturesContainer>
      </FeaturesSection>

      <CTASection>
        <CTAContainer>
          <CTATitle>Ready to Showcase Your Product's Transparency?</CTATitle>
          <CTADescription>
            Join the movement towards greater product transparency and consumer trust. 
            Submit your product today and receive a comprehensive transparency report.
          </CTADescription>
          <Button variant="outline" size="large" onClick={() => navigate('/submit')}>
            Get Started Now
          </Button>
        </CTAContainer>
      </CTASection>
    </>
  );
};

export default LandingPage;