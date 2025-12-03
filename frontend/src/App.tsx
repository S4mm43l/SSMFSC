import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import FsoLanding from './pages/FsoLanding';
import FsoRfLanding from './pages/FsoRfLanding';
import StatisticalLanding from './pages/StatisticalLanding';
import SteadyFso from './pages/SteadyFso';
import SteadyRf from './pages/SteadyRf';
import Statistical from './pages/Statistical';
import DataPage from './pages/DataPage';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/fso" element={<FsoLanding />} />
            <Route path="/fso/simulation" element={<SteadyFso />} />
            <Route path="/fso-rf" element={<FsoRfLanding />} />
            <Route path="/fso-rf/simulation" element={<SteadyRf />} />
            <Route path="/statistical" element={<StatisticalLanding />} />
            <Route path="/statistical/simulation" element={<Statistical />} />
            <Route path="/data" element={<DataPage />} />
          </Routes>
        </Layout>
      </Router>
    </LanguageProvider>
  );
}

export default App;
