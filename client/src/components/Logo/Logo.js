import React from 'react';
import styled, {keyframes} from 'styled-components';

const animate = keyframes`
  15% {
    top: -250px;
  }
  100% {
    top: 0;
  }
`;

const StyledLogo = styled.h1`
  text-align: center;
  font-size: 42px;
  top: -250px;
  position: relative;
  transition: 1.5s;
  animation-fill-mode: forwards;
  animation-name: ${animate};
  animation-duration: 2.45s;
`;
const Red = styled.span`
  color: #ff4400;
`;
function Logo(props) {
  return (
    <StyledLogo {...props}>
      <Red>Я</Red>ндекс Go
    </StyledLogo>
  );
}

export default Logo;