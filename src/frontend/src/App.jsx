import { useState } from 'react'
import HyperbolicPromptGenerator from './Components/HyperApp'
import { BrowserRouter as Router} from 'react-router-dom';

function App() {

  return (
    <Router>
    <HyperbolicPromptGenerator />
    </Router>
  )
}

export default App
