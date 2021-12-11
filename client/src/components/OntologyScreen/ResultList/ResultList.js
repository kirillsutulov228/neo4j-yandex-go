import ResultItem from '../ResultItem/ResultItem.js';

export default function ResultList({ res, ...props }) {
  if (!res || !res.length) {
    return <div style={{ textAlign: 'center' }}>Описание не найдено</div>;
  }
  return res.map((v, i) => <ResultItem key={i} index={i} v={v} />);
}
