import React from 'react';
import styled, { keyframes } from 'styled-components';
import busIcon from '../icons/bus.svg';

const pulse = keyframes`
  0% {
    transform: scale(1)
  }
  50% {
    transform: scale(0.75)
  }
  100% {
    transform: scale(1)
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: white;
`;

const Image = styled.img`
  width: 30%;
  max-width: 150px;
  margin: 2rem;
  animation: 1s ${pulse} linear infinite;
`;

const Headline = styled.h2`
  color: #7d5c65;
  font-weight: normal;
  font-size: 2rem;
`;

const LoadingScreen: React.SFC = (): React.ReactElement => (
  <LoadingContainer>
    <Image src={busIcon} alt="logo" />
    <Headline>Завантаження…</Headline>
  </LoadingContainer>
);

export default LoadingScreen;
