import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Steady & Statistical Modeling of FSO and Hybrid FSO/RF Systems
      </h1>
      <p className="text-xl text-gray-600 mb-12">
        Select a model to begin calculation and analysis.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
        <Link to="/steady-fso" className="group">
          <div className="bg-green-600 text-white p-8 rounded-xl shadow-lg transform transition-transform group-hover:scale-105 h-64 flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold mb-4">Steady FSO Model</h2>
            <p className="text-green-100">Evaluate steady parameters of FSO transmission channel.</p>
          </div>
        </Link>

        <Link to="/steady-rf" className="group">
          <div className="bg-green-700 text-white p-8 rounded-xl shadow-lg transform transition-transform group-hover:scale-105 h-64 flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold mb-4">Steady FSO/RF Model</h2>
            <p className="text-green-100">Evaluate steady parameters of Hybrid FSO/RF channels.</p>
          </div>
        </Link>

        <Link to="/statistical" className="group">
          <div className="bg-green-800 text-white p-8 rounded-xl shadow-lg transform transition-transform group-hover:scale-105 h-64 flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold mb-4">Statistical Model</h2>
            <p className="text-green-100">Evaluate statistical parameters from Fog sensor device.</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
