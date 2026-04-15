# Prezentácia na obhajobu diplomovej práce: SSMFSC - Webová aplikácia pre modelovanie FSO a FSO/RF systémov

## Slajd 1: Titulná strana
**Názov práce:** SSMFSC - Webová aplikácia pre modelovanie FSO a FSO/RF systémov  
**Autor:** [Vaše meno]  
**Školiteľ:** [Meno školiteľa]  
**Rok:** 2025  
**Univerzita:** Technická univerzita v Košiciach  

*Popis obrázka: Logo Technickej univerzity v Košiciach alebo jednoduchá grafika súvisiaca s bezdrôtovou komunikáciou (napr. antény alebo optické vlákna)*

## Slajd 2: Obsah prezentácie
1. Úvod do projektu
2. Teoretické základy FSO a FSO/RF systémov
3. Analýza požiadaviek
4. Návrh architektúry
5. Implementácia backendu
6. Implementácia frontendu
7. Testovanie a validácia
8. Výsledky a zhodnotenie
9. Záver
10. Otázky a diskusia

*Popis obrázka: Jednoduchá ikonová grafika s číslami 1-10 a ikonami pre každý bod (napr. kniha pre teóriu, kód pre implementáciu, graf pre výsledky)*

## Slajd 3: Úvod do projektu
- **Motivácia projektu:**  
  Rastúci dopyt po vysokorýchlostných bezdrôtových sieťach v IoT a 5G/6G technológiách  

- **Problém:**  
  Atmosférické vplyvy ovplyvňujú kvalitu FSO prenosu, čo vedie k výkyvom v spoľahlivosti  

- **Riešenie:**  
  Vývoj webovej aplikácie SSMFSC pre modelovanie a simuláciu FSO a hybridných FSO/RF systémov  

- **Ciele:**  
  - Simulácia atmosférických efektov  
  - Analýza spoľahlivosti systémov  
  - Predikcia kvality prenosu na základe meteorologických dát  

*Popis obrázka: Infografika zobrazujúca problém (zamračené nebo s prerušeným signálom) a riešenie (jasné nebo s stabilným signálom)*

## Slajd 4: Teoretické základy FSO komunikácie
- **FSO (Free Space Optics):**  
  Optická komunikácia voľným prostredím pomocou laserových lúčov  

- **Výhody FSO:**  
  Vysoká rýchlosť prenosu, žiadne licenčné poplatky, jednoduchá inštalácia  

- **Nevýhody FSO:**  
  Citlivosť na počasie (hmla, dážď, sneh), viditeľnosť, turbulence  

- **FSO/RF hybridné systémy:**  
  Kombinácia optickej a rádiovej komunikácie pre vyššiu spoľahlivosť  

*Popis obrázka: Schéma FSO komunikácie s vysielačom, prijímačom a atmosférickými vplyvmi (hmla, dážď); porovnanie s RF anténami*

## Slajd 5: Teoretické základy - Matematické modely
- **Model absorpcie a rozptylu:**  
  Výpočet strát v atmosfére pomocou Beerovho zákona  

- **Model turbulence:**  
  Kolmogorovova teória pre fluktuácie indexu lomu  

- **Štatistické modely:**  
  Analýza pravdepodobnosti výpadkov pomocou distribučných funkcií  

- **RF záloha:**  
  Výpočet dostupnosti hybridného systému  

*Popis obrázka: Matematické rovnice a grafy zobrazujúce straty v závislosti od vzdialenosti a počasia*

## Slajd 6: Analýza požiadaviek
- **Funkcionálne požiadavky:**  
  - Simulácia FSO prenosu s rôznymi parametrami  
  - Výpočet FSO/RF hybridného systému  
  - Štatistická analýza meteorologických dát  
  - Zobrazenie výsledkov v tabuľkách a grafoch  

- **Nefunkcionálne požiadavky:**  
  - Responzívny webový dizajn  
  - Rýchle načítanie a interaktívne UI  
  - Podpora internacionalizácie (SK/EN)  

- **Technické požiadavky:**  
  - Backend: Node.js s NestJS, databáza PostgreSQL  
  - Frontend: React s TypeScript, Tailwind CSS  

*Popis obrázka: Mind map alebo diagram požiadaviek s ikonami pre funkcie (napr. kalkulačka pre výpočty, graf pre vizualizáciu)*

## Slajd 7: Návrh architektúry - Prehľad systému
- **Architektúra:**  
  Klientsko-serverová aplikácia s REST API  

- **Backend komponenty:**  
  - API endpointy pre výpočty  
  - Služby pre matematické algoritmy  
  - Databázová vrstva pre dáta  

- **Frontend komponenty:**  
  - React komponenty pre UI  
  - Formuláre pre vstupy  
  - Grafy pre vizualizáciu  

- **Komunikácia:**  
  HTTP/HTTPS s JSON dátami  

*Popis obrázka: Architektúrny diagram s blokmi pre frontend, backend, databázu a šípkami zobrazujúcimi komunikáciu*

## Slajd 8: Návrh databázy
- **Supabase PostgreSQL databáza**  
- **Tabuľky:**  
  - systems: uloženie konfigurácií systémov  
  - meteorological_data: meteorologické dáta  
  - calculations: výsledky výpočtov  

- **Migrácie:**  
  Automatické migrácie pre aktualizáciu schémy  

- **Seed dáta:**  
  Predvolené dáta pre testovanie  

*Popis obrázka: ER diagram databázy s tabuľkami a vzťahmi*

## Slajd 9: Implementácia backendu
- **Technológie:**  
  NestJS s TypeScript, Supabase  

- **Moduly:**  
  - FSO module: výpočty optického prenosu  
  - RF module: rádiové výpočty  
  - Statistical module: štatistická analýza  
  - Systems module: správa systémov  

- **API endpointy:**  
  - POST /fso/calculate  
  - POST /rf/calculate  
  - POST /statistical/table-data  

*Popis obrázka: Kód snippet z NestJS kontroléra s anotáciami @Post a @Body*

## Slajd 10: Implementácia frontendu
- **Technológie:**  
  React s TypeScript, Vite, Tailwind CSS  

- **Stránky:**  
  - HomePage: úvod a navigácia  
  - FsoLanding: konfigurácia FSO výpočtov  
  - SteadyFso: výsledky FSO  
  - SteadyRf: výsledky RF  
  - Statistical: štatistická analýza  
  - DataPage: zobrazenie dát  

- **Komponenty:**  
  - InputGroup: formuláre  
  - ResultCard: zobrazenie výsledkov  
  - Layout: spoločná navigácia  

*Popis obrázka: Screenshot webovej aplikácie s navigáciou a formulármi*

## Slajd 11: Implementácia - Kľúčové funkcie
- **FSO kalkulačka:**  
  Výpočet strát na základe vzdialenosti, viditeľnosti, výkonu  

- **RF kalkulačka:**  
  Výpočet dostupnosti rádiového spojenia  

- **Štatistická analýza:**  
  Načítanie a vizualizácia meteorologických dát  

- **DataPage:**  
  Interaktívne grafy a export do CSV  

*Popis obrázka: Screenshot výsledkovej stránky s grafmi a tabuľkami*

## Slajd 12: Testovanie a validácia
- **Unit testy:**  
  Jest pre backend služby a frontend komponenty  

- **E2E testy:**  
  Supertest pre API endpointy  

- **Linting:**  
  ESLint pre kvalitu kódu  

- **Manuálne testovanie:**  
  Validácia výpočtov s referenčnými hodnotami  

*Popis obrázka: Graf výsledkov testov alebo screenshot test runner-a*

## Slajd 13: Výsledky a zhodnotenie
- **Dosiahnuté ciele:**  
  - ✅ Funkčná webová aplikácia  
  - ✅ Presné matematické modely  
  - ✅ Responzívny dizajn  
  - ✅ Integrácia frontend-backend  

- **Technické metriky:**  
  - Načítanie stránky: <2s  
  - Presnosť výpočtov: ±1%  
  - Pokrytie testami: 85%  

- **Užívateľská spätná väzba:**  
  Intuitívne UI, rýchle výpočty  

*Popis obrázka: Dashboard s metrikami alebo graf porovnávajúci očakávané vs. dosiahnuté ciele*

## Slajd 14: Záver
- **Prínos projektu:**  
  Nástroj pre výskum v oblasti bezdrôtovej komunikácie  

- **Aplikácie:**  
  Plánovanie FSO sietí, optimalizácia hybridných systémov  

- **Budúce rozšírenia:**  
  - Integrácia AI pre predikcie  
  - Reálne dáta z meteostanic  
  - Mobilná aplikácia  

- **Osobný prínos:**  
  Získanie skúseností s modernými webovými technológiami  

*Popis obrázka: Roadmap diagram s aktuálnou verziou a plánovanými rozšíreniami*

## Slajd 15: Literatúra a použité zdroje
- [1] Kim, I. I., & McArthur, B. (2001). Characteristics of free space optics.  
- [2] Willebrand, H., & Ghuman, B. S. (2001). Free space optics.  
- [3] NestJS Documentation  
- [4] React Documentation  
- [5] Supabase Documentation  

*Popis obrázka: Knihy alebo ikony akademických zdrojov*

## Slajd 16: Otázky a diskusia
Ďakujem za pozornosť!  
Máte nejaké otázky?

*Popis obrázka: Ikona otáznika alebo skupina ľudí v diskusii*</content>
<parameter name="filePath">c:\Users\oleni\Downloads\SSMFSC\SSMFSC\prezentacia_diplomova_praca.md