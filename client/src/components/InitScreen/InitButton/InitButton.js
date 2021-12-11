import React from 'react';
import styled from 'styled-components';
import {Transition} from 'react-transition-group';

const StyledInitButton = styled.div`
  background-color: #ffb937;
  border-radius: 50px;
  left: 50%;
  overflow: hidden;
  transform: translateX(-50%);
  padding: 10px 20px;
  position: absolute;
  transition: 2s;
  width: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  height: 50px;
  cursor: pointer;
`;

const transitionStyles = {
  entering: { opacity: 0, top: '220px' },
  entered:  { opacity: 1, top: '120px' },
  exiting:  { opacity: 0, top: '300px' },
  exited:  { display: 'none' },
};

function InitButton({ in: inProp, onClick, children }) {
  return (
    <Transition in={inProp} appear={true} timeout={{appear:1700, enter: 1000, exit: 1500}}>
      {
        state => (
          <StyledInitButton onClick={onClick} style={transitionStyles[state]}>
            {children}
          </StyledInitButton>
        )
      }
    </Transition>
  );
}

export default InitButton;