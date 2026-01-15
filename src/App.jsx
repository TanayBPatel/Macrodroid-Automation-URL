import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import YearProgress from './components/YearProgress';
import PhotoPage from './pages/PhotoPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<YearProgress />} />
        <Route path="/photo" element={<PhotoPage />} />
      </Routes>
    </Router>
  );
}

export default App;
