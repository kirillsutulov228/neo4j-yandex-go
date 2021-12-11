import styled from 'styled-components';
import ResultList from '../ResultList/ResultList.js';
import { CircularProgress } from '@material-ui/core';

const QueryResult = styled.div`
  border-radius: 2px;
  position: relative;
  overflow-y: scroll;
  border: 1px solid #dedede;
  width: 100%;
  height: 500px;
  grid-column: 2 / 3;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 2px 10px;
`;

export default function ResultDisplay({ output, isLoading }) {
  return (
    <QueryResult>
      {output && <ResultList res={output} />}
      {isLoading && (
        <CircularProgress
          style={{
            display: 'block',
            position: 'absolute',
            top: 'calc(50% - 20px)',
            left: 'calc(50% - 20px)'
          }}
        />
      )}
    </QueryResult>
  );
}
