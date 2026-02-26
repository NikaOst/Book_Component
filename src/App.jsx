import './App.css';
import { useState } from 'react';
import Particles from './components/Particles';
import Landing from './components/Landing';
import Book from './components/book';

function App() {
  const [showBook, setShowBook] = useState(false);

  return (
    <>
      <Particles />
      {!showBook && <Landing onEnter={() => setShowBook(true)} />}
      {showBook && <Book shouldOpen={true} />}
    </>
  );
}

export default App;
