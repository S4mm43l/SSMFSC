import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const HomePage = () => {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 md:pt-8 rounded-[28px] bg-white/70 shadow-[0_20px_60px_rgba(21,27,44,0.08)] ring-1 ring-white/40 backdrop-blur-[2px] -mt-4 relative z-10">
      
   
      <section className="text-center pt-6 md:pt-10">
        <h1 className="text-3xl md:text-5xl font-semibold mb-3 tracking-tight text-[#1043b3]">
          {t('hero_title')}
        </h1>
        <p className="mx-auto max-w-3xl text-base md:text-lg leading-relaxed text-[#1043b3] opacity-90">
          {t('hero_sub')}
        </p>
      </section>

   
      <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
   
        <a href="#hlavny-projekt" className="group block rounded-3xl p-6 bg-linear-to-r from-[#1043b3] to-[#1455e2] text-white shadow-[0_12px_30px_rgba(22,28,45,0.16),0_2px_8px_rgba(22,28,45,0.08)] transition-transform hover:-translate-y-1">
          <div className="flex flex-col xl:flex-row xl:items-baseline gap-2 mb-2">
             <div className="text-xl md:text-2xl font-semibold">{t('proj1_title')}</div>
             <div className="text-xs bg-black/20 px-2 py-1 rounded text-white/90 whitespace-nowrap font-medium">
               {t('proj1_id_label')} {t('main_value_id')}
             </div>
          </div>
          <p className="text-white/90 text-sm md:text-base">
            {t('proj1_desc')}
          </p>
          <span className="inline-block mt-4 underline decoration-sky-200/70 underline-offset-4 group-hover:decoration-white text-sm font-medium">
            {t('proj1_more')}
          </span>
        </a>

        <a href="#nadvazujuci-projekt" className="group block rounded-3xl p-6 bg-linear-to-r from-[#1043b3] to-[#1455e2] text-white shadow-[0_12px_30px_rgba(22,28,45,0.16),0_2px_8px_rgba(22,28,45,0.08)] transition-transform hover:-translate-y-1">
          <div className="flex flex-col xl:flex-row xl:items-baseline gap-2 mb-2">
             <div className="text-xl md:text-2xl font-semibold">{t('proj2_title')}</div>
             <div className="text-xs bg-black/20 px-2 py-1 rounded text-white/90 whitespace-nowrap font-medium">
               {t('proj2_id_label')} {t('follow_value_id')}
             </div>
          </div>
          <p className="text-white/90 text-sm md:text-base">
            {t('proj2_desc')}
          </p>
          <span className="inline-block mt-4 underline decoration-sky-200/70 underline-offset-4 group-hover:decoration-white text-sm font-medium">
            {t('proj2_more')}
          </span>
        </a>
      </section>

  
      <section id="modely" className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
     
        <Link to="/fso" className="rounded-3xl p-8 bg-linear-to-br from-[#1043b3] to-[#1455e2] text-white shadow-[0_12px_30px_rgba(22,28,45,0.16)] overflow-hidden transition-transform hover:scale-[1.02] flex flex-col items-center text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7s2-2 5-2 5 2 8 2 5-2 5-2M3 12s2-2 5-2 5 2 8 2 5-2 5-2M3 17s2-2 5-2 5 2 8 2 5-2 5-2"/>
          </svg>
          <div className="text-xl md:text-2xl font-semibold">{t('card_fso_title')}</div>
          <p className="mt-2 text-sm text-white/90 max-w-xs">
            {t('card_fso_desc')}
          </p>
        </Link>

      
        <Link to="/fso-rf" className="rounded-3xl p-8 bg-linear-to-br from-[#1043b3] to-[#1455e2] text-white shadow-[0_12px_30px_rgba(22,28,45,0.16)] overflow-hidden transition-transform hover:scale-[1.02] flex flex-col items-center text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 19V8m0 0l-3 3m3-3l3 3m-7 8h8M4.5 6A9.969 9.969 0 0 1 12 3c2.761 0 5.26 1.12 7.07 2.93M3 9a9.97 9.97 0 0 1 3.28-4.78M21 9a9.97 9.97 0 0 0-3.28-4.78"/>
          </svg>
          <div className="text-xl md:text-2xl font-semibold">{t('card_fsorf_title')}</div>
          <p className="mt-2 text-sm text-white/90 max-w-xs">
            {t('card_fsorf_desc')}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/20">FSO</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/20">RF</span>
          </div>
        </Link>


        <Link to="/statistical" className="rounded-3xl p-8 bg-linear-to-br from-[#1455e2] to-[#3b82f6] text-white shadow-[0_12px_30px_rgba(22,28,45,0.16)] overflow-hidden transition-transform hover:scale-[1.02] flex flex-col items-center text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 20h18M7 10v6m5-10v10m5-7v7"/>
          </svg>
          <div className="text-xl md:text-2xl font-semibold">{t('card_stat_title')}</div>
          <p className="mt-2 text-sm text-white/90 max-w-xs">
            {t('card_stat_desc')}
          </p>
        </Link>
      </section>

      <section id="hlavny-projekt" className="mt-12 rounded-3xl overflow-hidden shadow">
        <div className="bg-linear-to-r from-[#1043b3] to-[#1455e2] px-6 py-4 text-white text-lg md:text-xl font-semibold">
          {t('main_section_title')}
        </div>
        <div className="relative bg-linear-to-br from-[#1043b3] to-[#1455e2] p-6 text-white/95">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex-1 space-y-1.5 text-[15px] leading-relaxed">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <p className="font-medium col-span-1">{t('main_label_name')}</p>
                <p className="col-span-3">{t('main_value_name')}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <p className="font-medium">{t('main_label_short')}</p>
                <p className="col-span-3">{t('main_value_short')}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <p className="font-medium">{t('main_label_id')}</p>
                <p className="col-span-3">{t('main_value_id')}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <p className="font-medium">{t('main_label_program')}</p>
                <p className="col-span-3">{t('main_value_program')}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <p className="font-medium">{t('main_label_pi')}</p>
                <p className="col-span-3">{t('main_value_pi')}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <p><span className="font-medium">{t('main_label_start')}</span> 01/2025</p>
                <p><span className="font-medium">{t('main_label_end')}</span> 08/2026</p>
                <p><span className="font-medium">{t('main_label_funds')}</span> 499 255,68€</p>
              </div>

              <div className="pt-2">
                <p className="font-medium mb-0.5">{t('main_label_annot')}</p>
                <p>{t('main_value_annot')}</p>
              </div>
            </div>

            <div className="flex justify-center md:justify-end mt-2 md:mt-0">
              <img src="/img/NextGenEU.png" alt="NextGenerationEU logo" className="w-60 md:w-72 object-contain bg-white rounded-md shadow-md p-2" />
            </div>
          </div>
        </div>
      </section>

    
      <section id="nadvazujuci-projekt" className="mt-8 rounded-3xl overflow-hidden shadow">
        <div className="bg-linear-to-r from-[#1043b3] to-[#1455e2] px-6 py-4 text-white text-lg md:text-xl font-semibold">
          {t('follow_section_title')}
        </div>
        <div className="relative bg-linear-to-br from-[#1043b3] to-[#1455e2] p-6 text-white/95">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex-1 space-y-1.5 text-[15px] leading-relaxed">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <p className="font-medium col-span-1">{t('follow_label_name')}</p>
                <p className="col-span-3">{t('follow_value_name')}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <p className="font-medium">{t('follow_label_short')}</p>
                <p className="col-span-3">{t('follow_value_short')}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <p className="font-medium">{t('follow_label_id')}</p>
                <p className="col-span-3">{t('follow_value_id')}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <p className="font-medium">{t('follow_label_program')}</p>
                <p className="col-span-3">{t('follow_value_program')}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <p className="font-medium">{t('follow_label_coord')}</p>
                <p className="col-span-3">{t('follow_value_coord')}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <p><span className="font-medium">{t('follow_label_start')}</span> 01/2025</p>
                <p><span className="font-medium">{t('follow_label_end')}</span> 06/2026</p>
                <p><span className="font-medium">{t('follow_label_funds')}</span> 6000€</p>
              </div>

              <div className="pt-2">
                <p className="font-medium mb-0.5">{t('follow_label_annot')}</p>
                <p>{t('follow_value_annot')}</p>
              </div>
            </div>

            <div className="flex justify-center md:justify-end mt-2 md:mt-0">
              <img src="/img/NextGenEU.png" alt="NextGenerationEU logo" className="w-60 md:w-72 object-contain bg-white rounded-md shadow-md p-2" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
