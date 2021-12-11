import styled from 'styled-components';
import { CircularProgress } from '@material-ui/core';
import { Transition } from 'react-transition-group';

const StyledLoading = styled(CircularProgress)`
  display: block;
  position: absolute;
  top: 240px;
  left: calc(50% - 20px);
`;

function InitLoadingProgress({ isLoading }) {
  return (
    <Transition unmountOnExit={true} in={isLoading} timeout={0}>
      {(state) => {
        return <StyledLoading />;
      }}
    </Transition>
  );
}

export default InitLoadingProgress;
