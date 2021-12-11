import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import MySelect from './MySelect/MySelect.js';
import MyButton from './MyButton/MyButton.js';
import ResultDisplay from './ResultDisplay/ResultDisplay.js';

const appearance = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const StyledOntologyScreen = styled.div`
  animation-delay: 1.2s;
  opacity: 0;
  width: 1000px;
  animation-name: ${appearance};
  animation-duration: 1s;
  animation-fill-mode: forwards;
  display: grid;
  grid-gap: 25px;
  grid-template-columns: 1fr 2fr 1fr;
  margin: 0 auto;
`;

const Menu = styled.nav`
  padding: 10px;
  width: 225px;
`;

function OntologyScreen({ nodes, scenarios }) {
  const [label, setLabel] = useState('');
  const [name, setName] = useState('');
  const [scenario, setScenario] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState(null);

  async function sendGetRequest(url, options, delay = 0) {
    setIsLoading(true);
    setOutput(null);
    const data = (await axios.get(url, options)).data;
    setTimeout(() => {
      setOutput(data);
      setIsLoading(false);
    }, delay);
  }

  async function getElementsInfo() {
    await sendGetRequest('/ontology', { params: { labels: label, names: name } });
  }

  async function getAllNodeEvents() {
    await sendGetRequest('/ontology/child', { params: { labels: label, names: name, relations: 'hasEvent' } });
  }

  async function getDepthScreenEvents() {
    await sendGetRequest('/ontology/screen_events', { params: { name } });
  }

  async function getScreenElements() {
    await sendGetRequest('/ontology/child', { params: { labels: 'Screen', names: name, relations: 'hasElement' } });
  }

  async function getScenario() {
    if (!scenario) return;
    await sendGetRequest('/ontology/scenarios', { params: { name: scenario } });
  }

  function selectScenario(event) {
    setScenario(event.target.value);
  }

  function selectLabel(event) {
    setLabel(event.target.value);
    setName('');
  }

  function selectName(event) {
    setName(event.target.value);
  }

  function getEvents() {
    label === 'Screen' ? getDepthScreenEvents() : getAllNodeEvents();
  }

  return (
    <StyledOntologyScreen>
      <Menu>
        <MySelect name='Сценарий' list={scenarios} id='scenarioSelect' value={scenario} onChange={selectScenario} />
        <MyButton name='Загрузить сценарий' onClick={getScenario} />
      </Menu>
      <ResultDisplay output={output} isLoading={isLoading} />
      <Menu>
        <MySelect
          name='Класс'
          emptyText='Выбрать все'
          id='labelSelect'
          value={label}
          list={Object.keys(nodes)}
          onChange={selectLabel}
        />
        <MySelect
          name='Имя'
          id='nameSelect'
          emptyText='Выбрать все'
          value={name}
          onChange={selectName}
          list={Object.values(nodes[label] || []).reduce((acc, v) => {
            acc.push(v.properties.name);
            return acc;
          }, [])}
        />
        <MyButton name='Метаописание' onClick={getElementsInfo} />
        {label !== 'Event' && <MyButton name='Связанные события' onClick={getEvents} />}
        {label === 'Screen' && <MyButton name='Элементы' onClick={getScreenElements} />}
      </Menu>
    </StyledOntologyScreen>
  );
}

export default OntologyScreen;
