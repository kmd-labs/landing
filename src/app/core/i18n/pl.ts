import { Dict } from "./i18n.types";

export const PL: Dict = {
  htmlLang: "pl",
  docTitle: "KMD Labs · Interaktywne Wizualizacje Danych i Inżynieria Naukowa",
  appName: "Laboratorium",
  langName: "Polski",

  // Top HUD & Navigation
  changeLanguage: "Język",
  scrollToTopAria: "Wróć do interaktywnej symulacji",
  navPortfolio: "Portfolio",
  navSpecialities: "Specjalizacje",
  navTeam: "Zespół",
  navContact: "Kontakt",
  menuOpenAria: "Otwórz menu nawigacji",
  menuCloseAria: "Zamknij menu nawigacji",

  // Hero Section
  heroKicker: "KMD LABS · OBSERWACJA ZIEMI I KARTOGRAFIA",
  heroTitle: "Naukowa Wizualizacja Danych i",
  heroHighlight: "Inżynieria Geoprzestrzenna",
  heroSubtitle:
    "Przekształcamy Twoje złożone dane w piękne i interaktywne aplikacje.",
  heroPrimaryCta: "Odkryj Obserwatorium",
  heroSecondaryCta: "Nawiąż Kontakt",
  heroInteractionHint:
    "Obserwatorium ze środkiem oka cyklonu: mezoskalowy rdzeń wiru, cyrkulacja ściany oka i telemetria dynamiki oceanicznej",
  heroDataSource: "Dane meteorologiczne NOAA: wiatr i woda",
  telemetryLiveBadge: "LIVE",
  telemetrySourceLabel: "Dane meteorologiczne NOAA: wiatr i woda",
  telemetrySourceShort: "Dane meteo NOAA",
  telemetrySourceUrl: "https://www.noaa.gov/",
  telemetrySourceTitle:
    "NOAA – Amerykańska Narodowa Służba Oceaniczna i Atmosferyczna",
  showMore: "Pokaż więcej",
  showMoreAria: "Przewiń w dół, aby zobaczyć obserwatorium i projekty KMD Labs",

  // Live Hero Telemetry
  telemetryLatLon: "OBSERWATORIUM SZER/DŁUG",
  telemetryVelocity: "WYSOKOŚĆ FALI OCEANICZNEJ",
  telemetryVorticity: "PRZEWAŻAJĄCE ROZKOŁYSY",
  telemetryAnomaly: "TEMPERATURA WODY",
  telemetryRegime: "REŻIM CYRKULACJI",
  telemetryParticles: "AKTYWNE LINIE PRĄDU",
  thermalScaleCold: "-3.0°C (Chłodna Woda)",
  thermalScaleWarm: "+3.0°C (Ciepła Woda)",
  velocityScaleSlow: "0.5m Spokojny Prąd",
  velocityScaleFast: "8.5m+ Sztormowe Fale",
  regimeLaminar: "Przepływ Laminarny",
  regimeTransition: "Niestabilność Falowa i Meandry",
  regimeRollup: "Strefa Zwijania Wirów",
  regimeVortex: "Ścieżka Wirowa (Wiry)",
  regimeMeander: "Przeważające Wiatry Zachodnie",
  regimeColdCoreRing: "Cyklonalny Wir Niżowy",
  regimeWarmCoreRing: "Antycyklonalny Wyż Podzwrotnikowy",
  regimeWakeEddy: "Wir Śladu i Prąd Wsteczny",
  regimeRossbyWave: "Falowanie Rossby’ego",
  regimeTradeWinds: "Pasaty (Wiatry Wschodnie)",
  regimeWesterlies: "Wiatry Zachodnie (Ryczące Czterdziestki)",
  regimePolarVortex: "Wir Okołobiegunowy / Wschodnie Wiatry Polarne",
  regimeDoldrums: "MSZ / Równikowe Cisze",
  regimeJetStream: "Prąd Strumieniowy",
  telemetryLiveWind: "BIEŻĄCA TELEMETRIA OPEN-METEO",
  telemetryUpdatedDaily: "Aktualizowane codziennie o 00:00 UTC",
  canvasLabelGulfStream: "DOPŁYW LAMINARNY",
  canvasLabelMeanderPinch: "NIESTABILNOŚĆ ŚCINANIA",
  canvasLabelColdCoreRing: "SPÓJNY RDZEŃ WIROWY",
  canvasLabelWakeReverse: "PRĄD WSTECZNY I WIRY BRZEGOWE",
  canvasStageLaminar: "01 LAMINARNY",
  canvasStageTransition: "02 FALOWANIE",
  canvasStageRollup: "03 ZWIJANIE",
  canvasStageVortex: "04 ŚCIEŻKA WIROWA",

  // Portfolio Section
  portfolioKicker: "ARCHIWUM OBSERWATORIUM",
  portfolioTitle: "Kluczowe Aplikacje Interaktywne",
  portfolioLead:
    "Każdy projekt projektujemy z myślą o zerowej barierze wejścia, dedykowanych potokach WebGL/Canvas i rzeczywistej telemetrii planetarnej.",
  launchApp: "Uruchom Wizualizację",
  projects: [
    {
      id: "el-nino",
      tag: "01 / KLIMATOLOGIA PLANETARNA",
      title: "El Niño — Oscylacja Południowa",
      subtitle:
        "Globalny globus 3D WebGL: anomalia termiczna, cyrkulacja Walkera i kronika skutków klimatycznych",
      description:
        "Interaktywny cyfrowy bliźniak sprzężonego układu ocean-atmosfera na Pacyfiku. Integruje wieloletnie klatki temperatury powierzchni morza (SST), anomalie NOAA/Copernicus w czasie rzeczywistym oraz dynamiczne wektory wiatru i fal.",
      metrics: [
        { label: "ROZDZIELCZOŚĆ", value: "0.25° Globalna" },
        { label: "SILNIK", value: "WebGL / Three.js" },
        { label: "PŁYNNOŚĆ", value: "60 FPS" },
      ],
      tags: ["WebGL 3D", "Three.js", "Telemetria Klimatu", "Linie Prądu"],
      url: "https://kmd-labs.github.io/el-nino/",
    },
    {
      id: "watershed",
      tag: "02 / OCEANOGRAFIA I EKOLOGIA",
      title: "Ładunki Rzeczne Bałtyku (Watershed)",
      subtitle:
        "Spływ azotu i fosforu ze zlewni rzecznych oraz telemetria hipoksji i beztlenowych stref dennych",
      description:
        "Kompleksowa analiza geoprzestrzenna ponad 85 zlewni Morza Bałtyckiego w 14 krajach. Wizualizuje 50 lat spływu zanieczyszczeń rolniczych i ubytku tlenu w głębiach, wentylowanych przez wlewy wód z Morza Północnego.",
      metrics: [
        { label: "ZLEWNIE", value: "85+ Rzek" },
        { label: "BAZA DANYCH", value: "HELCOM PLC-7" },
        { label: "PUSTYNIE TLENOWE", value: "1960–2026" },
      ],
      tags: [
        "Geoinformatyka GIS",
        "Kartografia",
        "Biogeochemia",
        "Dane HELCOM",
      ],
      url: "https://kmd-labs.github.io/watershed/",
    },
    {
      id: "golfstrom",
      tag: "03 / DYNAMIKA TERMOHALINOWA",
      title: "Golfstrom",
      subtitle:
        "Prąd Zatokowy Północnego Atlantyku: transport masy, włókna wirowości i kinetyka mezoskalowa",
      description:
        "Wysokorozdzielcza adwekcja pól wektorowych modelująca cyrkulację termohalinową (AMOC). Generuje tysiące cząstek Lagrange’a odzwierciedlających prędkości prądów granicznych, zasolenie i gradienty temperatur.",
      metrics: [
        { label: "SYSTEM PRĄDÓW", value: "Północny Atlantyk" },
        { label: "ADWEKCJA", value: "Pole Wektorowe" },
        { label: "OBLICZENIA", value: "Klient GL" },
      ],
      tags: [
        "Dynamika Oceanu",
        "Cząstki Lagrange’a",
        "AMOC",
        "Interaktywny Canvas",
      ],
      url: "https://kmd-labs.github.io/golfstrom/",
    },
    {
      id: "viadrus-ai",
      tag: "04 / INNOWACJE SATELITARNE",
      title: "Viadrus AI (Zwycięzca CASSINI)",
      subtitle:
        "1. Miejsce w Finale Europejskim — 11. Hackathon CASSINI organizowany przez EUSPA i Komisję Europejską",
      description:
        "Projekt założycielski KMD: wczesne wykrywanie wycieków w miejskich sieciach wodociągowych poprzez korelację danych radarowych Copernicus Sentinel-1 (SAR) i wielospektralnych Sentinel-2 z telemetrią hydrauliczną.",
      metrics: [
        { label: "NAGRODA", value: "1. Miejsce w Europie" },
        { label: "ORGANIZATOR", value: "EUSPA / KE" },
        { label: "SATELITY", value: "Sentinel-1 i 2" },
      ],
      tags: [
        "Copernicus SAR",
        "Uczenie Maszynowe",
        "Nagroda EUSPA",
        "Infrastruktura",
      ],
      url: "https://defence-industry-space.ec.europa.eu/orbit-water-tap-11th-cassini-hackathon-2026-05-08_en",
      isExternal: true,
    },
  ],

  // Specialities Section
  specialitiesKicker: "NASZE KOMPETENCJE",
  specialitiesTitle:
    "Gdzie Nauka o Ziemi Spotyka Nowoczesną Inżynierię Oprogramowania",
  specialitiesLead:
    "Łączymy akademicką obserwację Ziemi, terabajty danych przestrzennych i nowoczesną, ultra-wydajną architekturę webową.",
  disciplines: [
    {
      id: "geoviz",
      title: "Geowizualizacja i 3D WebGL",
      lead: "Przekształcanie wielogigabajtowych rastrów przestrzennych i pól atmosferycznych w płynny interaktywny canvas 60 FPS.",
      points: [
        "Autorskie shadery WebGL, Three.js i GLSL dla odwzorowań sferycznych oraz płaskich.",
        "Układy cząstek Lagrange’a, pola wektorowe curl-noise i termodynamiczne gradienty barwne.",
        "Precyzyjne renderowanie dopasowane do ekranów Retina z czytelną typografią naukową.",
      ],
      tools: [
        "WebGL",
        "Three.js",
        "HTML5 Canvas",
        "GLSL",
        "D3.js",
        "Matematyka Projekcji",
      ],
    },
    {
      id: "data-eng",
      title: "Inżynieria Danych i Dane Satelitarne",
      lead: "Kompletne potoki przetwarzania od orbit satelitarnych po zoptymalizowane kafelki klienta.",
      points: [
        "Zautomatyzowana integracja danych Copernicus Sentinel-1 (SAR), Sentinel-2 oraz morskich zasobów NOAA.",
        "Potoki przestrzenne ETL, kafelkowanie rastrów, przetwarzanie GeoTIFF i kompresja binarna (bin.gz).",
        "Kontrola jakości danych (QA), kalibracja sensorów i niezawodne schematy geoprzestrzenne.",
      ],
      tools: [
        "Copernicus EO",
        "Python / GDAL",
        "Rasterio",
        "PostGIS",
        "Cloudflare Workers",
        "DuckDB",
      ],
    },
    {
      id: "ai-ml",
      title: "AI, Uczenie Maszynowe i Detekcja Anomalii",
      lead: "Dedykowane modele uczenia maszynowego wykrywające anomalie fizyczne, wycieki i zmiany środowiskowe.",
      points: [
        "Czasoprzestrzenna detekcja anomalii w szeregach wilgotnościowych SAR i sieciach sensorów.",
        "Modelowanie predykcyjne progów oceanograficznych (niedotlenienie den, zakwity sinic).",
        "Wdrażanie na brzegu sieci (edge computing) przy minimalnym zużyciu pamięci i zerowym cold-starcie.",
      ],
      tools: [
        "PyTorch",
        "Scikit-Learn",
        "Detekcja Anomalii",
        "Szeregi Czasowe ML",
        "ONNX Web",
      ],
    },
  ],

  // Team Section
  teamKicker: "laboratory",
  teamTitle: "O nas",
  teamLead:
    "kmd-labs to trzyosobowy zespół wywodzący się z Viadrus AI, pierwszej polskiej drużyny, która wygrała europejski finał hackathonu CASSINI organizowanego przez Agencję Unii Europejskiej ds. Programu Kosmicznego (EUSPA). Nasze zwycięskie rozwiązanie wykorzystywało dane satelitarne do wczesnego wykrywania wycieków z sieci wodociągowych.",
  teamLeads: [
    "kmd-labs to trzyosobowy zespół wywodzący się z Viadrus AI, pierwszej polskiej drużyny, która wygrała europejski finał hackathonu CASSINI organizowanego przez Agencję Unii Europejskiej ds. Programu Kosmicznego (EUSPA). Nasze zwycięskie rozwiązanie wykorzystywało dane satelitarne do wczesnego wykrywania wycieków z sieci wodociągowych.",
    "Po finale postanowiliśmy połączyć moc obliczeniową naszych zwojów mózgowych. Każdy z nas przychodzi z innej dziedziny, ale łączy nas pasja do geoinformatyki i danych satelitarnych, a także do detekcji anomalii, uczenia maszynowego, tworzenia oprogramowania i geowizualizacji.",
    "Masz dane i nie wiesz, jak je pokazać na mapie albo w przestrzeni? Napisz do nas!",
  ],
  teamRefs: [
    {
      label: "11. hackathon CASSINI – relacja KE",
      href: "https://defence-industry-space.ec.europa.eu/orbit-water-tap-11th-cassini-hackathon-2026-05-08_en",
      title:
        "defence-industry-space.ec.europa.eu – From Orbit to the Water Tap: 11th CASSINI Hackathon",
      aria: "Relacja Komisji Europejskiej z 11. hackathonu CASSINI",
    },
    {
      label: "CASSINI Hackathons – portfolio",
      href: "https://www.cassini.eu/hackathons/portfolio",
      title: "cassini.eu/hackathons/portfolio – Meet the Winners",
      aria: "CASSINI Hackathons – portfolio zwycięskich zespołów",
    },
    {
      label: "kmd-labs na LinkedIn",
      href: "https://www.linkedin.com/company/kmd-lab",
      title: "linkedin.com/company/kmd-lab – kmd-labs",
      aria: "Profil firmowy kmd-labs na LinkedIn",
    },
  ],
  teamFocusLabel: "Zadania",
  founders: [
    {
      name: "Adrian Kulik",
      role: "Fullstack & AI Engineer · Współzałożyciel",
      bio: "Z wykształcenia magister inżynier środowiska, z wyboru AI Engineer. Moja przygoda z kodem zaczęła się w 2019 roku od three.js i sztuki generatywnej, co zaowocowało tworzeniem autorskich rozwiązań w AR (rzeczywistości rozszerzonej). Dziś skupiam się na sztucznej inteligencji i uczeniu maszynowym, łącząc technologię z realnym rozwiązywaniem problemów, czego dowodem jest zwycięstwo w 11. edycji hackathonu CASSINI. Poza kodowaniem działam w open source, gram, tworzę muzykę i fotografuję.",
      tags: [
        "Programowanie fullstack",
        "Grafika 3D",
        "DevOps",
        "UX/UI",
        "Sztuczna inteligencja",
        "Uczenie maszynowe",
      ],
      linkedin: "https://www.linkedin.com/in/adrian-kulik",
      github: "https://github.com/adriankulik",
      photo: "assets/design-system/team/adrian-kulik.jpg",
    },
    {
      name: "Leszek Michalak",
      role: "Lead Data Engineer · Współzałożyciel",
      bio: "Magister Administracji Uniwersytetu Wrocławskiego. Zawodowo pracuję jako Data Engineer w dużej firmie z branży FMCG. Oprócz zarządzania bazami danych specjalizuję się w wykrywaniu anomalii, kontroli jakości danych i automatyzacji procesów. W projekcie Viadrus AI zebrałem cały zespół i odpowiadałem za pozyskanie danych. Z Marcinem pracowałem wcześniej w tej samej instytucji finansowej – jako stażysta zadawałem mu bardzo dużo pytań. Lubię udowadniać, że niemożliwe jednak jest możliwe. W wolnym czasie fotografuję i maluję krajobrazy, interesuję się mapami i grami strategicznymi.",
      tags: [
        "Inżynieria danych",
        "Uczenie maszynowe",
        "Analityka danych",
        "Pozyskiwanie danych",
        "Jakość danych",
      ],
      linkedin: "https://www.linkedin.com/in/leszek-michalak-422745b6/",
      photo: "assets/design-system/team/leszek-michalak.jpg",
    },
    {
      name: "Marcin Derewońko",
      role: "Specjalista ds. Geoinformatyki i AI · Współzałożyciel",
      bio: "Jestem absolwentem Geografii Morza na Wydziale Nauk o Ziemi Uniwersytetu Szczecińskiego, Geoinformacji na Wydziale Nauk Geograficznych i Geologicznych Uniwersytetu im. Adama Mickiewicza w Poznaniu oraz Sztucznej Inteligencji w Finansach i Controllingu Przedsiębiorstw na Akademii Leona Koźmińskiego. Od 12 lat pracuję jako konsultant funkcjonalny systemów klasy ERP. Po godzinach tworzę systemy do detekcji anomalii w danych finansowych i satelitarnych przy użyciu uczenia maszynowego. Moją wielką pasją jest również tworzenie geowizualizacji. Swoje umiejętności w zakresie sztucznej inteligencji rozwijam od 4 lat. Wierzę, że przyszłość należy do ekspertów domenowych, którzy potrafią skutecznie wykorzystywać AI jako narzędzie w swojej codziennej pracy. Prywatnie pasjonuję się treningiem siłowym, grami planszowymi, Magic: The Gathering oraz ogrodnictwem.",
      tags: [
        "Geoinformatyka",
        "Geowizualizacje",
        "Detekcja anomalii",
        "Uczenie maszynowe",
        "Sztuczna inteligencja",
      ],
      linkedin: "https://linkedin.com/in/mmder",
      photo: "assets/design-system/team/marcin-derewonko.jpg",
    },
  ],

  // Contact Section
  contactKicker: "KONTAKT",
  contactTitle: "Napisz do nas",
  contactLead:
    "Masz pomysł na projekt lub chcesz podjąć współpracę przy interaktywnej aplikacji geoprzestrzennej? Skontaktuj się z nami.",
  contactSubmitBtn: "Wyślij e-mail",
  contactClientNote:
    "Otwiera wiadomość w Twoim domyślnym programie pocztowym. Żadne dane nie są zapisywane na serwerze.",
  contactMailSubject: "Zapytanie o projekt · KMD Labs",
  contactMailBody:
    "Dzień dobry zespole KMD Labs,\n\nchciał(a)bym porozmawiać o projekcie związanym z interaktywną wizualizacją danych lub aplikacją geoprzestrzenną.\n\nPozdrawiam,",
  contactTypeDemo: "Zamów Prezentację Live",
  contactTypeCall: "Umów Rozmowę Techniczną",
  contactTypeMessage: "Wyślij Zapytanie Projektowe",
  fieldName: "Imię i Nazwisko",
  fieldNamePlaceholder: "np. dr Anna Kowalska",
  fieldOrg: "Organizacja / Instytucja",
  fieldOrgPlaceholder:
    "np. Agencja Kosmiczna, Instytut Badawczy, Przedsiębiorstwo",
  fieldEmail: "Służbowy Adres E-mail",
  fieldEmailPlaceholder: "anna@instytut.pl",
  fieldBrief: "Zarys Projektu / Charakterystyka Zbioru Danych",
  fieldBriefPlaceholder:
    "Opisz swój zbiór danych, cele badawcze oraz oczekiwany harmonogram wdrożenia wizualizacji...",
  contactPlaceholderBadge: "TRYB BEZPIECZNY / PIASKOWNICA",
  contactPlaceholderNotice:
    "Bezpośredni serwerowy transfer e-mail jest w trakcie kalibracji. Kliknięcie „Prześlij Zarys” skopiuje koordynaty KMD Labs i wskaże bezpośrednie kanały kontaktu bez utrwalania Twoich danych osobowych na serwerze.",
  contactTransmitBtn: "Prześlij Zarys (Symulacja)",
  contactCopiedFeedback:
    "✓ Skopiowano dane do schowka! Zapraszamy do kontaktu na LinkedIn / E-mail...",
  contactDirectMailNotice:
    "Wolisz bezpośredni kontakt? Napisz do nas na LinkedIn lub skontaktuj się z wybranym członkiem zespołu.",
  contactGdprNotice:
    "Klauzula RODO: Prywatność traktujemy priorytetowo. Na stronie nie używamy plików cookies, trackerów ani skryptów profilujących. Wszelkie przetwarzanie telemetrii odbywa się w Twojej przeglądarce.",

  // Footer
  footerRights: "Wszelkie prawa zastrzeżone.",
  footerTagline:
    "KMD Labs · Interaktywne Wizualizacje Danych i Inteligencja Geoprzestrzenna",
};
