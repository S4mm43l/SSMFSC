import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const FsoLanding = () => {
  const { t, language } = useLanguage();

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-linear-to-r from-[#1043b3] to-[#1455e2]">
      <section className="flex flex-col md:flex-row items-center justify-between mx-auto max-w-6xl px-6 py-20">
        <div className="md:w-1/2 text-left">
          <h1 className="text-4xl md:text-5xl font-semibold mb-4 text-white">
            {t('fso_title')}
          </h1>
          <p className="text-white/90 text-base leading-relaxed">
            {t('fso_desc')}
          </p>
        </div>
        <Link to="/fso/simulation" className="md:w-1/2 flex justify-center mt-10 md:mt-0">
          <img
            src={language === 'sk' ? "/img/fso.png" : "/img/fso-en.png"}
            alt="Model Steady FSO"
            className="max-w-md w-full rounded-3xl shadow-lg transition-transform duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl"
          />
        </Link>
      </section>
    </div>
  );
};

export default FsoLanding;
