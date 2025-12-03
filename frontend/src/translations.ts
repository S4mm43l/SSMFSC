export const translations = {
  sk: {
    // Global
    page_title: "Modelovanie FSO a FSO/RF | TUKE",
    nav_university: "Technická univerzita v Košiciach",
    nav_home: "Domov",
    nav_fso: "Model Steady FSO",
    nav_fso_rf: "Model Steady FSO/RF",
    nav_stat: "Štatistický model",
    nav_data: "Dáta",
    footer_title: "Technická univerzita v Košiciach",
    footer_address_text: "Letná 1/9, 042 00 Košice-Sever · Tel.: 055 / 602 1111 · E-mail:",
    footer_copy: "© 2025 Technická univerzita v Košiciach",

    // Index
    hero_title: "Modelovanie FSO a FSO/RF",
    hero_sub:
      "Interaktívna webová aplikácia pre modelovanie FSO a hybridných FSO/RF systémov. Financované z Plánu obnovy NextGenerationEU · Výskumná agentúra SR",

    proj1_title: "Hlavný projekt",
    proj1_desc:
      "Kľúčové digitálne technológie v oblasti bezdrôtových širokopásmových odolných prenosových sietí",
    proj1_id_label: "Číslo projektu:",
    proj1_more: "prečítať viac…",

    proj2_title: "Nadväzujúci projekt",
    proj2_desc:
      "Využitie AI v oblasti bezdrôtových širokopásmových odolných prenosových sietí",
    proj2_id_label: "Číslo projektu:",
    proj2_more: "prečítať viac…",

    card_fso_title: "Model Steady FSO",
    card_fso_desc:
      "Prenos optického signálu voľným prostredím s dôrazom na atmosférické vplyvy a spoľahlivosť prenosu.",
    card_fsorf_title: "Model Steady FSO/RF",
    card_fsorf_desc:
      "Hybridný model kombinujúci FSO a RF komunikáciu pre vyššiu dostupnosť a spoľahlivosť.",
    card_stat_title: "Štatistický model",
    card_stat_desc:
      "Analýza meteorologických dát a predikcia výkyvov v kvalite prenosu.",

    main_section_title: "Hlavný projekt",
    main_label_name: "Názov projektu",
    main_value_name:
      "Kľúčové digitálne technológie v oblasti bezdrôtových širokopásmových odolných prenosových sietí",
    main_label_short: "Skratka",
    main_value_short: "KeDiTeWiBReTNe",
    main_label_id: "Číslo projektu",
    main_value_id: "09I05-03-V02-00019",
    main_label_program: "Program/agentúra",
    main_value_program: "Plán obnovy NextGenerationEU / Výskumná agentúra SR",
    main_label_pi: "Zodpovedný riešiteľ projektu",
    main_value_pi: "doc. Ing. Ľuboš Ovseník, PhD.",
    main_label_start: "Začiatok:",
    main_label_end: "Koniec:",
    main_label_funds: "Celkové financie:",
    main_label_annot: "Anotácia",
    main_value_annot:
      "Projekt bude riešiť problematiku možnosti využitia odolných optických bezdrôtových prenosových sietí v prostredí IoT, FTTx PON sietí a sietí 5G/6G. Výskum sa zameria na aplikovanie AI pri tvrdom prepínaní a hľadaní optimálnej prenosovej cesty medzi terminálmi v hybridnom FSO/RF systéme.",

    follow_section_title: "Nadväzujúci projekt",
    follow_label_name: "Názov projektu",
    follow_value_name:
      "Využitie AI v oblasti bezdrôtových širokopásmových odolných prenosových sietí",
    follow_label_short: "Skratka",
    follow_value_short: "UAIReWiBTNe",
    follow_label_id: "Číslo projektu",
    follow_value_id: "09I03-03-V05-00015",
    follow_label_program: "Program/agentúra",
    follow_value_program: "Plán obnovy NextGenerationEU / Výskumná agentúra SR",
    follow_label_coord: "Koordinátor za TUKE",
    follow_value_coord: "Ing. Zuzana Liščinská",
    follow_label_start: "Začiatok:",
    follow_label_end: "Koniec:",
    follow_label_funds: "Celkové financie:",
    follow_label_annot: "Anotácia",
    follow_value_annot:
      "Projekt rieši hybridný FSO/RF prenos s dátovým prístupom založeným na historických dátach. Jadrom je včasná predikcia RSSI pomocou LSTM a rozhodovanie DQL agenta o tvrdom prepínaní medzi FSO a RF s cieľom stabilného prenosu a dodržania QoS.",

    // FSO
    fso_title: "Model Steady FSO",
    fso_desc:
      "Model Steady FSO (Free Space Optics) predstavuje systém optickej komunikácie, ktorý prenáša dáta cez voľné prostredie pomocou svetelných lúčov. Simulácia sa zameriava na atmosférické vplyvy, útlm signálu a spoľahlivosť prenosu v rôznych poveternostných podmienkach. Tento model umožňuje testovať efektivitu FSO prepojení v mestskom a medzimestskom prostredí.",

    // FSO/RF Model
    fso_rf_title: "Model Steady FSO/RF",
    fso_rf_desc:
      "Model Steady FSO/RF predstavuje hybridný komunikačný systém, ktorý spája optický FSO prenos s bezdrôtovým RF kanálom. Cieľom je zabezpečiť spoľahlivý prenos aj v prípadoch zhoršených atmosférických podmienok, kde samotný FSO kanál nie je dostatočný. Hybridný model umožňuje prepínanie medzi kanálmi na základe kvality signálu (RSSI) a minimalizuje výpadky v dátovom prenose.",

    // Statistical Model
    stat_title: "Štatistický model",
    stat_desc:
      "Štatistický model sa zameriava na analýzu meteorologických dát, ktoré ovplyvňujú kvalitu prenosu optického signálu. Cieľom je identifikovať vzťahy medzi parametrami prostredia, ako sú hmla, dážď alebo teplotné zmeny, a degradáciou signálu. Model využíva historické dáta na predikciu výkyvov kvality prenosu a optimalizáciu parametrov systému FSO/RF.",

    // Data
    data_title: "Dáta a spracovanie",
    data_intro:
      "Táto sekcia zhromažďuje experimentálne a meteorologické dáta využívané pri modelovaní FSO a FSO/RF systémov. Obsahuje informácie o viditeľnosti, sile signálu, rýchlosti vetra a teplotných zmenách, ktoré ovplyvňujú kvalitu optického prenosu. Dáta slúžia ako základ pre analýzu a simuláciu výkonu jednotlivých modelov.",
    data_select_title: "Výber dát podľa dátumu",
    th_time: "Čas",
    th_vis: "Viditeľnosť (km)",
    th_temp: "Teplota (°C)",
    th_wind: "Rýchlosť vetra (m/s)",
    data_placeholder: "Zvoľte dátum pre zobrazenie údajov",
    loadDataBtn: "Načítať údaje",
    downloadBtn: "Stiahnuť údaje (.csv)"
  },

  en: {
    // Global
    page_title: "FSO and FSO/RF Modelling | TUKE",
    nav_university: "Technical University of Košice",
    nav_home: "Home",
    nav_fso: "Steady FSO Model",
    nav_fso_rf: "Steady FSO/RF Model",
    nav_stat: "Statistical Model",
    nav_data: "Data",
    footer_title: "Technical University of Košice",
    footer_address_text: "Letná 1/9, 042 00 Košice-Sever · Tel.: +421 55 602 1111 · E-mail:",
    footer_copy: "© 2025 Technical University of Košice",

    // Index
    hero_title: "FSO and FSO/RF Modelling",
    hero_sub:
      "Interactive web application for modelling FSO and hybrid FSO/RF systems. Funded by NextGenerationEU · Research Agency of Slovakia",

    proj1_title: "Main Project",
    proj1_desc:
      "Key digital technologies in the field of wireless broadband resilient transmission networks",
    proj1_id_label: "Project number:",
    proj1_more: "read more…",

    proj2_title: "Follow-up Project",
    proj2_desc:
      "Use of AI in wireless broadband resilient transmission networks",
    proj2_id_label: "Project number:",
    proj2_more: "read more…",

    card_fso_title: "Steady FSO Model",
    card_fso_desc:
      "Free-space optical signal transmission with emphasis on atmospheric effects and reliability.",
    card_fsorf_title: "Steady FSO/RF Model",
    card_fsorf_desc:
      "Hybrid model combining FSO and RF communication for higher availability and reliability.",
    card_stat_title: "Statistical Model",
    card_stat_desc:
      "Analysis of meteorological data and prediction of variations in transmission quality.",

    main_section_title: "Main Project",
    main_label_name: "Project title",
    main_value_name:
      "Key digital technologies in the field of wireless broadband resilient transmission networks",
    main_label_short: "Acronym",
    main_value_short: "KeDiTeWiBReTNe",
    main_label_id: "Project number",
    main_value_id: "09I05-03-V02-00019",
    main_label_program: "Programme / agency",
    main_value_program:
      "Recovery Plan NextGenerationEU / Research Agency of the Slovak Republic",
    main_label_pi: "Principal investigator",
    main_value_pi: "Assoc. Prof. Ľuboš Ovseník, PhD.",
    main_label_start: "Start:",
    main_label_end: "End:",
    main_label_funds: "Total funding:",
    main_label_annot: "Abstract",
    main_value_annot:
      "The project addresses the use of robust optical wireless transmission networks in IoT, FTTx PON and 5G/6G networks. Research focuses on applying AI for hard switching and finding optimal transmission paths between terminals in a hybrid FSO/RF system.",

    follow_section_title: "Follow-up Project",
    follow_label_name: "Project title",
    follow_value_name:
      "Use of AI in wireless broadband resilient transmission networks",
    follow_label_short: "Acronym",
    follow_value_short: "UAIReWiBTNe",
    follow_label_id: "Project number",
    follow_value_id: "09I03-03-V05-00015",
    follow_label_program: "Programme / agency",
    follow_value_program:
      "Recovery Plan NextGenerationEU / Research Agency of the Slovak Republic",
    follow_label_coord: "Coordinator at TUKE",
    follow_value_coord: "Ing. Zuzana Liščinská",
    follow_label_start: "Start:",
    follow_label_end: "End:",
    follow_label_funds: "Total funding:",
    follow_label_annot: "Abstract",
    follow_value_annot:
      "The project investigates hybrid FSO/RF transmission with data-driven access based on historical records. Its core is early RSSI prediction using LSTM and DQL-based decision-making for hard switching between FSO and RF to maintain stable transmission and QoS.",

    // FSO Model
    fso_title: "Steady FSO Model",
    fso_desc:
      "The Steady FSO (Free Space Optics) model represents an optical communication system that transmits data through free space using light beams. The simulation focuses on atmospheric influences, signal attenuation, and transmission reliability under various weather conditions. This model enables testing the efficiency of FSO links in urban and interurban environments.",

    // FSO/RF Model
    fso_rf_title: "Steady FSO/RF Model",
    fso_rf_desc:
      "The Steady FSO/RF model represents a hybrid communication system that combines optical FSO transmission with a wireless RF channel. Its goal is to ensure reliable data transfer even under poor atmospheric conditions where the FSO channel alone is insufficient. The hybrid system dynamically switches between channels based on signal quality (RSSI) to minimize data loss and maintain transmission stability.",

    // Statistical Model
    stat_title: "Statistical Model",
    stat_desc:
      "The statistical model focuses on analyzing meteorological data affecting the quality of optical signal transmission. Its goal is to identify relationships between environmental parameters such as fog, rain, or temperature variations and signal degradation. The model uses historical data to predict fluctuations in transmission quality and optimize the parameters of the FSO/RF system.",

    // Data
    data_title: "Data and Processing",
    data_intro:
      "This section gathers experimental and meteorological data used in modelling FSO and FSO/RF systems. It includes information on visibility, signal strength, wind speed, and temperature variations that affect optical transmission quality. The data serve as the basis for analysis and simulation of model performance.",
    data_select_title: "Select data by date",
    th_time: "Time",
    th_vis: "Visibility (km)",
    th_temp: "Temperature (°C)",
    th_wind: "Wind speed (m/s)",
    data_placeholder: "Select a date to display data",
    loadDataBtn: "Load data",
    downloadBtn: "Download data (.csv)"
  }
};
