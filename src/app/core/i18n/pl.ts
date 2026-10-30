import { Dict } from './i18n.types';

export const PL: Dict = {
  htmlLang: 'pl',
  docTitle: 'KMD Labs · Interaktywne Wizualizacje Danych i Inżynieria Naukowa',
  appName: 'Laboratorium',
  langName: 'Polski',

  // Top HUD & Navigation
  changeLanguage: 'Język',
  scrollToTopAria: 'Wróć do interaktywnej symulacji',
  navPortfolio: 'Portfolio',
  navSpecialities: 'Specjalizacje',
  navTeam: 'Zespół',
  navContact: 'Kontakt',

  // Hero Section
  heroKicker: 'KMD LABS · OBSERWACJA ZIEMI I KARTOGRAFIA',
  heroTitle: 'Naukowa Wizualizacja Danych i',
  heroHighlight: 'Inżynieria Geoprzestrzenna',
  heroSubtitle:
    'Przekształcamy złożoną telemetrię satelitarną, prądy oceaniczne i zbiory danych planetarnych w ultra-płynne, publikacyjne doświadczenia interaktywne w przeglądarce.',
  heroPrimaryCta: 'Odkryj Obserwatorium',
  heroSecondaryCta: 'Nawiąż Kontakt',
  heroInteractionHint:
    'Obserwatorium ze środkiem oka cyklonu: mezoskalowy rdzeń wiru, cyrkulacja ściany oka i telemetria dynamiki oceanicznej',
  heroDataSource: 'Wektory Wiatru i Morza: Telemetria Open-Meteo i NOAA GFS (00:00 UTC)',
  showMore: 'Pokaż więcej',
  showMoreAria: 'Przewiń w dół, aby zobaczyć obserwatorium i projekty KMD Labs',

  // Live Hero Telemetry
  telemetryLatLon: 'OBSERWATORIUM SZER/DŁUG',
  telemetryVelocity: 'WYSOKOŚĆ FALI OCEANICZNEJ',
  telemetryVorticity: 'PRZEWAŻAJĄCE ROZKOŁYSY',
  telemetryAnomaly: 'TEMPERATURA WODY',
  telemetryRegime: 'REŻIM CYRKULACJI',
  telemetryParticles: 'AKTYWNE LINIE PRĄDU',
  thermalScaleCold: '-3.0°C (Chłodna Woda)',
  thermalScaleWarm: '+3.0°C (Ciepła Woda)',
  velocityScaleSlow: '0.5m Spokojny Prąd',
  velocityScaleFast: '8.5m+ Sztormowe Fale',
  regimeLaminar: 'Przepływ Laminarny',
  regimeTransition: 'Niestabilność Falowa i Meandry',
  regimeRollup: 'Strefa Zwijania Wirów',
  regimeVortex: 'Ścieżka Wirowa (Wiry)',
  regimeMeander: 'Przeważające Wiatry Zachodnie',
  regimeColdCoreRing: 'Cyklonalny Wir Niżowy',
  regimeWarmCoreRing: 'Antycyklonalny Wyż Podzwrotnikowy',
  regimeWakeEddy: 'Wir Śladu i Prąd Wsteczny',
  regimeRossbyWave: 'Falowanie Rossby’ego',
  regimeTradeWinds: 'Pasaty (Wiatry Wschodnie)',
  regimeWesterlies: 'Wiatry Zachodnie (Ryczące Czterdziestki)',
  regimePolarVortex: 'Wir Okołobiegunowy / Wschodnie Wiatry Polarne',
  regimeDoldrums: 'MSZ / Równikowe Cisze',
  regimeJetStream: 'Prąd Strumieniowy',
  telemetryLiveWind: 'BIEŻĄCA TELEMETRIA OPEN-METEO',
  telemetryUpdatedDaily: 'Aktualizowane codziennie o 00:00 UTC',
  canvasLabelGulfStream: 'DOPŁYW LAMINARNY',
  canvasLabelMeanderPinch: 'NIESTABILNOŚĆ ŚCINANIA',
  canvasLabelColdCoreRing: 'SPÓJNY RDZEŃ WIROWY',
  canvasLabelWakeReverse: 'PRĄD WSTECZNY I WIRY BRZEGOWE',
  canvasStageLaminar: '01 LAMINARNY',
  canvasStageTransition: '02 FALOWANIE',
  canvasStageRollup: '03 ZWIJANIE',
  canvasStageVortex: '04 ŚCIEŻKA WIROWA',

  // Portfolio Section
  portfolioKicker: 'ARCHIWUM OBSERWATORIUM',
  portfolioTitle: 'Kluczowe Aplikacje Interaktywne',
  portfolioLead:
    'Każdy projekt projektujemy z myślą o zerowej barierze wejścia, dedykowanych potokach WebGL/Canvas i rzeczywistej telemetrii planetarnej.',
  launchApp: 'Uruchom Wizualizację',
  projects: [
    {
      id: 'el-nino',
      tag: '01 / KLIMATOLOGIA PLANETARNA',
      title: 'El Niño — Oscylacja Południowa',
      subtitle: 'Globalny globus 3D WebGL: anomalia termiczna, cyrkulacja Walkera i kronika skutków klimatycznych',
      description:
        'Interaktywny cyfrowy bliźniak sprzężonego układu ocean-atmosfera na Pacyfiku. Integruje wieloletnie klatki temperatury powierzchni morza (SST), anomalie NOAA/Copernicus w czasie rzeczywistym oraz dynamiczne wektory wiatru i fal.',
      metrics: [
        { label: 'ROZDZIELCZOŚĆ', value: '0.25° Globalna' },
        { label: 'SILNIK', value: 'WebGL / Three.js' },
        { label: 'PŁYNNOŚĆ', value: '60 FPS' }
      ],
      tags: ['WebGL 3D', 'Three.js', 'Telemetria Klimatu', 'Linie Prądu'],
      url: 'https://kmd-labs.github.io/el-nino/'
    },
    {
      id: 'watershed',
      tag: '02 / OCEANOGRAFIA I EKOLOGIA',
      title: 'Ładunki Rzeczne Bałtyku (Watershed)',
      subtitle: 'Spływ azotu i fosforu ze zlewni rzecznych oraz telemetria hipoksji i beztlenowych stref dennych',
      description:
        'Kompleksowa analiza geoprzestrzenna ponad 85 zlewni Morza Bałtyckiego w 14 krajach. Wizualizuje 50 lat spływu zanieczyszczeń rolniczych i ubytku tlenu w głębiach, wentylowanych przez wlewy wód z Morza Północnego.',
      metrics: [
        { label: 'ZLEWNIE', value: '85+ Rzek' },
        { label: 'BAZA DANYCH', value: 'HELCOM PLC-7' },
        { label: 'PUSTYNIE TLENOWE', value: '1960–2026' }
      ],
      tags: ['Geoinformatyka GIS', 'Kartografia', 'Biogeochemia', 'Dane HELCOM'],
      url: 'https://kmd-labs.github.io/watershed/'
    },
    {
      id: 'golfstrom',
      tag: '03 / DYNAMIKA TERMOHALINOWA',
      title: 'Golfstrom',
      subtitle: 'Prąd Zatokowy Północnego Atlantyku: transport masy, włókna wirowości i kinetyka mezoskalowa',
      description:
        'Wysokorozdzielcza adwekcja pól wektorowych modelująca cyrkulację termohalinową (AMOC). Generuje tysiące cząstek Lagrange’a odzwierciedlających prędkości prądów granicznych, zasolenie i gradienty temperatur.',
      metrics: [
        { label: 'SYSTEM PRĄDÓW', value: 'Północny Atlantyk' },
        { label: 'ADWEKCJA', value: 'Pole Wektorowe' },
        { label: 'OBLICZENIA', value: 'Klient GL' }
      ],
      tags: ['Dynamika Oceanu', 'Cząstki Lagrange’a', 'AMOC', 'Interaktywny Canvas'],
      url: 'https://kmd-labs.github.io/golfstrom/'
    },
    {
      id: 'viadrus-ai',
      tag: '04 / INNOWACJE SATELITARNE',
      title: 'Viadrus AI (Zwycięzca CASSINI)',
      subtitle: '1. Miejsce w Finale Europejskim — 11. Hackathon CASSINI organizowany przez EUSPA i Komisję Europejską',
      description:
        'Projekt założycielski KMD: wczesne wykrywanie wycieków w miejskich sieciach wodociągowych poprzez korelację danych radarowych Copernicus Sentinel-1 (SAR) i wielospektralnych Sentinel-2 z telemetrią hydrauliczną.',
      metrics: [
        { label: 'NAGRODA', value: '1. Miejsce w Europie' },
        { label: 'ORGANIZATOR', value: 'EUSPA / KE' },
        { label: 'SATELITY', value: 'Sentinel-1 i 2' }
      ],
      tags: ['Copernicus SAR', 'Uczenie Maszynowe', 'Nagroda EUSPA', 'Infrastruktura'],
      url: 'https://defence-industry-space.ec.europa.eu/orbit-water-tap-11th-cassini-hackathon-2026-05-08_en',
      isExternal: true
    }
  ],

  // Specialities Section
  specialitiesKicker: 'NASZE KOMPETENCJE',
  specialitiesTitle: 'Gdzie Nauka o Ziemi Spotyka Nowoczesną Inżynierię Oprogramowania',
  specialitiesLead:
    'Łączymy akademicką obserwację Ziemi, terabajty danych przestrzennych i nowoczesną, ultra-wydajną architekturę webową.',
  disciplines: [
    {
      id: 'geoviz',
      title: 'Geowizualizacja i 3D WebGL',
      lead: 'Przekształcanie wielogigabajtowych rastrów przestrzennych i pól atmosferycznych w płynny interaktywny canvas 60 FPS.',
      points: [
        'Autorskie shadery WebGL, Three.js i GLSL dla odwzorowań sferycznych oraz płaskich.',
        'Układy cząstek Lagrange’a, pola wektorowe curl-noise i termodynamiczne gradienty barwne.',
        'Precyzyjne renderowanie dopasowane do ekranów Retina z czytelną typografią naukową.'
      ],
      tools: ['WebGL', 'Three.js', 'HTML5 Canvas', 'GLSL', 'D3.js', 'Matematyka Projekcji']
    },
    {
      id: 'data-eng',
      title: 'Inżynieria Danych i Dane Satelitarne',
      lead: 'Kompletne potoki przetwarzania od orbit satelitarnych po zoptymalizowane kafelki klienta.',
      points: [
        'Zautomatyzowana integracja danych Copernicus Sentinel-1 (SAR), Sentinel-2 oraz morskich zasobów NOAA.',
        'Potoki przestrzenne ETL, kafelkowanie rastrów, przetwarzanie GeoTIFF i kompresja binarna (bin.gz).',
        'Kontrola jakości danych (QA), kalibracja sensorów i niezawodne schematy geoprzestrzenne.'
      ],
      tools: ['Copernicus EO', 'Python / GDAL', 'Rasterio', 'PostGIS', 'Cloudflare Workers', 'DuckDB']
    },
    {
      id: 'ai-ml',
      title: 'AI, Uczenie Maszynowe i Detekcja Anomalii',
      lead: 'Dedykowane modele uczenia maszynowego wykrywające anomalie fizyczne, wycieki i zmiany środowiskowe.',
      points: [
        'Czasoprzestrzenna detekcja anomalii w szeregach wilgotnościowych SAR i sieciach sensorów.',
        'Modelowanie predykcyjne progów oceanograficznych (niedotlenienie den, zakwity sinic).',
        'Wdrażanie na brzegu sieci (edge computing) przy minimalnym zużyciu pamięci i zerowym cold-starcie.'
      ],
      tools: ['PyTorch', 'Scikit-Learn', 'Detekcja Anomalii', 'Szeregi Czasowe ML', 'ONNX Web']
    }
  ],

  // Team Section
  teamKicker: 'BADACZE I INŻYNIEROWIE',
  teamTitle: 'Zespół KMD Labs',
  teamLead:
    'Interdyscyplinarny zespół łączący inżynierię środowiska, architekturę danych korporacyjnych i geoinformatykę morską.',
  founders: [
    {
      name: 'Adrian Kulik',
      role: 'Fullstack & AI Engineer · Współzałożyciel',
      bio: 'Z wykształcenia magister inżynier środowiska, z wyboru AI Engineer. Pionier grafiki generatywnej 3D, rzeczywistości rozszerzonej (AR) oraz zaawansowanych aplikacji przestrzennych. Główny programista zwycięskiego rozwiązania 11. edycji CASSINI Hackathon.',
      tags: ['Programowanie fullstack', 'Grafika 3D', 'DevOps', 'UX/UI', 'Sztuczna inteligencja', 'Uczenie maszynowe'],
      linkedin: 'https://www.linkedin.com/in/adrian-kulik',
      github: 'https://github.com/adriankulik',
      photo: 'assets/design-system/team/adrian-kulik.jpg'
    },
    {
      name: 'Leszek Michalak',
      role: 'Lead Data Engineer · Współzałożyciel',
      bio: 'Magister Administracji Uniwersytetu Wrocławskiego. Inżynier danych specjalizujący się w korporacyjnych bazach danych, wykrywaniu anomalii, kontroli jakości danych i automatyzacji procesów. Inicjator projektu Viadrus AI.',
      tags: ['Inżynieria danych', 'Uczenie maszynowe', 'Analityka danych', 'Pozyskiwanie danych', 'Jakość danych'],
      linkedin: 'https://www.linkedin.com/in/leszek-michalak-422745b6/',
      photo: 'assets/design-system/team/leszek-michalak.jpg'
    },
    {
      name: 'Marcin Derewońko',
      role: 'Geoinformatyk & Ekspert AI · Współzałożyciel',
      bio: 'Absolwent Geografii Morza, Geoinformacji oraz Sztucznej Inteligencji w Finansach. Od 12 lat konsultant systemów ERP, rozwijający modele uczenia maszynowego do detekcji anomalii satelitarnych oraz zaawansowane geowizualizacje.',
      tags: ['Geoinformatyka', 'Geowizualizacje', 'Detekcja anomalii', 'Uczenie maszynowe', 'Sztuczna inteligencja'],
      linkedin: 'https://linkedin.com/in/mmder',
      photo: 'assets/design-system/team/marcin-derewonko.jpg'
    }
  ],

  // Contact / Terminal Section
  contactKicker: 'BEZPIECZNY TERMINAL NAZIEMNY',
  contactTitle: 'Zainicjuj Projekt lub Rozmowę Techniczną',
  contactLead:
    'Dysponujesz złożonymi danymi planetarnymi, satelitarnymi lub środowiskowymi, które wymagają wizualizacji bądź analizy? Skontaktuj się z nami.',
  contactTypeDemo: 'Zamów Prezentację Live',
  contactTypeCall: 'Umów Rozmowę Techniczną',
  contactTypeMessage: 'Wyślij Zapytanie Projektowe',
  fieldName: 'Imię i Nazwisko',
  fieldNamePlaceholder: 'np. dr Anna Kowalska',
  fieldOrg: 'Organizacja / Instytucja',
  fieldOrgPlaceholder: 'np. Agencja Kosmiczna, Instytut Badawczy, Przedsiębiorstwo',
  fieldEmail: 'Służbowy Adres E-mail',
  fieldEmailPlaceholder: 'anna@instytut.pl',
  fieldBrief: 'Zarys Projektu / Charakterystyka Zbioru Danych',
  fieldBriefPlaceholder: 'Opisz swój zbiór danych, cele badawcze oraz oczekiwany harmonogram wdrożenia wizualizacji...',
  contactPlaceholderBadge: 'TRYB BEZPIECZNY / PIASKOWNICA',
  contactPlaceholderNotice:
    'Bezpośredni serwerowy transfer e-mail jest w trakcie kalibracji. Kliknięcie „Prześlij Zarys” skopiuje koordynaty KMD Labs i wskaże bezpośrednie kanały kontaktu bez utrwalania Twoich danych osobowych na serwerze.',
  contactTransmitBtn: 'Prześlij Zarys (Symulacja)',
  contactCopiedFeedback: '✓ Skopiowano dane do schowka! Zapraszamy do kontaktu na LinkedIn / E-mail...',
  contactDirectMailNotice:
    'Wolisz bezpośredni kontakt? Napisz do nas na LinkedIn lub skontaktuj się z wybranym członkiem zespołu.',
  contactGdprNotice:
    'Klauzula RODO: Prywatność traktujemy priorytetowo. Na stronie nie używamy plików cookies, trackerów ani skryptów profilujących. Wszelkie przetwarzanie telemetrii odbywa się w Twojej przeglądarce.',

  // Footer
  footerRights: 'Wszelkie prawa zastrzeżone.',
  footerTagline: 'KMD Labs · Interaktywne Wizualizacje Danych i Inteligencja Geoprzestrzenna'
};
