import React from 'react';
import styled from 'styled-components';
import InitButton from './InitButton/InitButton.js';
import { Transition } from 'react-transition-group';
import InitLoadingProgress from './InitLoadingProgress/InitLoadingProgress.js';

const StyledInitScreen = styled.div`
  position: relative;
`;

const ErrorMessage = styled.p`
  position: absolute;
  width: 100%;
  margin: 0;
  text-align: center;
  color: red;
  font-size: 24px;
  top: 240px;
`;

function InitScreen({ err, isLoading, isInitialized, initFn }) {
  return (
    <Transition in={!isInitialized} appear={true} unmountOnExit={true} timeout={{ exit: 2000 }}>
      {(state) => (
        <StyledInitScreen>
          <InitButton onClick={initFn} in={!isInitialized}>
            {isLoading || isInitialized ? 'Загрузка...' : 'Загрузить онтологию'}
          </InitButton>
          <InitLoadingProgress isLoading={isLoading}/>
          {err && <ErrorMessage>{err}</ErrorMessage>}
        </StyledInitScreen>
      )}
    </Transition>
  );
}

export default InitScreen;
