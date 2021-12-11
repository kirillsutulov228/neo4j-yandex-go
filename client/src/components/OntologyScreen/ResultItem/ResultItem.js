export default function ResultItem({ v, index, ...props }) {
  return (
    <div style={{ margin: '5px 0' }}>
      №: {index + 1}
      <br />
      Имя: {v.properties.name}
      <br />
      Класс: {v.labels.join(':')}
      <br />
      Описание: {v.properties.description ?? 'Недоступно'}
      <br />
      {v.labels.includes('Event') && 'Параметры: '}
      {v.labels.includes('Event') &&
        (!v.properties.params?.length
          ? 'Нет'
          : v.properties.params.map((p) => (
              <div style={{ margin: '2px 20px 5px' }}>
                Имя: {p.name}
                <br />
                Тип: {p.value}
                <br />
                Описание: {p.description || 'Недоступно'}
                <br />
              </div>
            )))}
      <hr />
    </div>
  );
}
