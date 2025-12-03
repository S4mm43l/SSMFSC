import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const isActive = (path: string) => {
    if (location.pathname === path) return true;
    if (path !== '/' && location.pathname.startsWith(path + '/')) return true;
    return false;
  };

  const getNavClass = (path: string) => {
    return isActive(path) 
      ? 'underline underline-offset-4 decoration-white/70' 
      : 'hover:text-white transition';
  };

  const toggleLanguage = () => {
    setLanguage(language === 'sk' ? 'en' : 'sk');
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-900">
   
      <header className="sticky top-0 z-50">
        <div className="bg-linear-to-r from-[#1043b3] to-[#1455e2] text-white border-b border-white/20 shadow-lg">
          <nav className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between gap-6">
            <Link to="/" className="flex items-center gap-4 min-w-0">
              <img src="/img/logo2.png" alt="TUKE logo" className="h-11 w-auto shrink-0" />
              <span className="text-sm sm:text-base md:text-lg font-medium text-white/85 truncate">
                {t('nav_university')}
              </span>
            </Link>

            <ul className="hidden md:flex items-center gap-8 text-base text-white/90 font-medium">
              <li><Link to="/" className={getNavClass('/')}>{t('nav_home')}</Link></li>
              <li><Link to="/fso" className={getNavClass('/fso')}>{t('nav_fso')}</Link></li>
              <li><Link to="/fso-rf" className={getNavClass('/fso-rf')}>{t('nav_fso_rf')}</Link></li>
              <li><Link to="/statistical" className={getNavClass('/statistical')}>{t('nav_stat')}</Link></li>
              <li><Link to="/data" className={getNavClass('/data')}>{t('nav_data')}</Link></li>
            </ul>

            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-5 py-2 text-sm text-white font-medium hover:bg-white/25 transition shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                      d="M12 3c2.755 0 5.25 1.122 7.071 2.943A10 10 0 1 1 4.929 5.943 9.958 9.958 0 0 1 12 3Zm0 0c2.5 2.5 2.5 15.5 0 18m9-9c-2.5 2.5-15.5 2.5-18 0"/>
              </svg>
              <span>{language === 'sk' ? 'EN' : 'SK'}</span>
            </button>
          </nav>
        </div>
      
        <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 py-3 shadow-sm">
           <div className="mx-auto max-w-6xl px-6 flex flex-wrap justify-center items-center gap-6 md:gap-10">
              <img src="/logo/logo-nextgen.png" alt="NextGenerationEU" className="h-10 md:h-14 w-auto object-contain" />
              <img src="/logo/POO_logo_modre-1024x500.png" alt="Plan Obnovy" className="h-10 md:h-14 w-auto object-contain" />
              <img src="/logo/UV_POO_farebne-2.png" alt="UV SR" className="h-10 md:h-14 w-auto object-contain" />
              <img src="/logo/Verzia-loga-s-popiskom_Verzia-loga-s-popiskom-Farebne-prevedenie-1-2.png" alt="VAIA" className="h-10 md:h-14 w-auto object-contain" />
              <img src="/logo/logo-ved-ag.png" alt="Vyskumna agentura" className="h-10 md:h-14 w-auto object-contain" />
           </div>
        </div>
      </header>

  
      <main className="grow bg-gray-50">
        {children}
      </main>

    
      <div className="h-[4px] w-full bg-linear-to-r from-[#1043b3] to-[#1455e2]"></div>
      <footer className="bg-[#0a3981] text-white text-center py-4 px-4 text-sm">
        <p className="font-semibold text-base">{t('nav_university')}</p>
        <p className="mt-1">
          <span>{t('footer_address_text')} </span>
          <a href="mailto:info@tuke.sk" className="underline hover:text-sky-300">info@tuke.sk</a>
        </p>
        <p className="mt-2 text-white/70 text-xs">{t('footer_copy')}</p>
      </footer>
    </div>
  );
};

export default Layout;
