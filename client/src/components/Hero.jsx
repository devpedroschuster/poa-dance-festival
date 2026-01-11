import styled from 'styled-components';

const HeroContainer = styled.section`
  height: 85vh;
  background-image: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80');
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  padding: 0 20px;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  
  span {
    color: #ff4081;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2.5rem;
  max-width: 600px;
  line-height: 1.6;
`;

const CTAButton = styled.button`
  padding: 15px 40px;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  background-color: #ff4081;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;

  &:hover {
    transform: scale(1.05);
    background-color: #e91e63;
  }
`;

export default function Hero() {
  return (
    <HeroContainer>
      <Title>O Ritmo <span>Conecta</span></Title>
      <Subtitle>
        Participe do POA Dance Festival. Workshops, batalhas e muita energia.
      </Subtitle>
      <CTAButton>Garantir Minha Vaga</CTAButton>
    </HeroContainer>
  );
}