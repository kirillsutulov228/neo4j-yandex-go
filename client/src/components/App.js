import { useState } from 'react';
import Logo from './Logo/Logo.js';
import axios from 'axios';
import InitScreen from './InitScreen/InitScreen.js';
import OntologyScreen from './OntologyScreen/OntologyScreen.js';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nodes, setNodes] = useState(null);
  const [scenarios, setScenarios] = useState(null);
  const [initErr, setInitErr] = useState(null);

  async function loadOntology() {
    if (isLoading) return;

    setIsLoading(true);
    setInitErr(null);
    try {
      await axios.post('/ontology');
      const dataNodes = (await axios.get('/ontology')).data;
      const scenariosNames = (await axios.get('/ontology/scenarios/names')).data;
      const newNodes = {};
      for (const dataNode of dataNodes) {
        dataNode.labels.forEach((label) => {
          if (!newNodes[label]) {
            newNodes[label] = [];
          }
          newNodes[label].push(dataNode);
        });
      }
      setNodes(newNodes);
      setScenarios(scenariosNames);
      setIsInitialized(true);
    } catch (err) {
      setInitErr('Ошибка: не удалось подключиться к базе данных');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='App'>
      <Logo style={isInitialized ? null : { marginTop: '100px' }} />
      <InitScreen err={initErr} isLoading={isLoading} isInitialized={isInitialized} initFn={loadOntology} />
      {isInitialized && <OntologyScreen scenarios={scenarios} nodes={nodes} />}
    </div>
  );
}

export default App;
