import { Dict } from "./i18n.types";
import { buildProjects } from "../config/projects.data";

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
    "Naukowe geowizualizacje, potoki obserwacji Ziemi i symulacje przestrzenne oparte na referencyjnych danych satelitarnych, oceanograficznych i wysokościowych.",
  launchApp: "Uruchom Wizualizację",
  viewRepository: "GitHub",
  portfolioPrevAria: "Poprzedni projekt",
  portfolioNextAria: "Następny projekt",
  portfolioSelectAria: "Wybierz projekt",
  projects: buildProjects([
    {
      id: "el-nino",
      tag: "01 / DYNAMIKA OCEAN–ATMOSFERA",
      title: "El Niño — Oscylacja Południowa (ENSO)",
      subtitle:
        "Zmienność termokliny Pacyfiku 3D, cyrkulacja Walkera i telekoneksje wskaźnika Niño 3.4",
      description:
        "Interaktywny model geofizyczny sprzężonego układu ocean–atmosfera w równikowym Pacyfiku. Wizualizuje dodatnie sprzężenie zwrotne Bjerknesa, osłabienie pasatów, zanik upwellingu oraz wielodekadowe anomalie temperatury powierzchni morza (SST) kształtujące globalne ekstrema hydroklimatyczne.",
      metrics: [
        { label: "KATEGORIA", value: "Edukacyjny" },
        { label: "TEMATYKA", value: "Klimatologia i Meteorologia" },
        { label: "ŹRÓDŁA DANYCH", value: "NOAA OISST · Copernicus" },
      ],
      tags: [
        "Dynamika ENSO",
        "Cyrkulacja Walkera",
        "Anomalie SST",
        "Globus 3D WebGL",
      ],
    },
    {
      id: "watershed",
      tag: "02 / BIOGEOCHEMIA MORZA I HYDROLOGIA",
      title: "Ładunki Biogenne i Hipoksja Bałtyku (Watershed)",
      subtitle:
        "Spływ azotu i fosforu ze zlewni, stratyfikacja halokliny oraz przydenne strefy beztlenowe",
      description:
        "Czasoprzestrzenna analiza bilansu ładunków biogennych z ponad 85 zlewni rzecznych zlewiska Bałtyku w 14 państwach. Śledzi pięć dekad antropogenicznej eutrofizacji i przydennej hipoksji przerywanej barotropowymi wlewami wód słonych z Morza Północnego (MBI).",
      metrics: [
        { label: "KATEGORIA", value: "Edukacyjny" },
        { label: "TEMATYKA", value: "Środowisko i Ekologia" },
        { label: "ŹRÓDŁA DANYCH", value: "HELCOM PLC-7 · SMHI" },
      ],
      tags: [
        "Eutrofizacja",
        "Hipoksja Przydenna",
        "Hydrologia GIS",
        "Dane HELCOM",
      ],
    },
    {
      id: "baltic",
      tag: "03 / GEOLOGIA CZWARTORZĘDU I PALEOKLIMAT",
      title: "Rekonstrukcja Postglacjalna Bałtyku",
      subtitle:
        "Deglacjacja lądolodu fennoskandzkiego, izostazja i ewolucja linii brzegowej (20 tys. BP → Dziś)",
      description:
        "Paleogeograficzna rekonstrukcja numerycznego modelu terenu (DEM) symulująca lepkosprężyste wypiętrzanie izostatyczne litosfery (GIA) i eustatyczny wzrost poziomu morza. Odtwarza przejścia od Bałtyckiego Jeziora Lodowego i Morza Yoldiowego przez Jezioro Ancylusowe po Morze Litorynowe.",
      metrics: [
        { label: "KATEGORIA", value: "Edukacyjny" },
        { label: "TEMATYKA", value: "Geologia i Paleogeografia" },
        { label: "ŹRÓDŁA DANYCH", value: "GEBCO · ICE-6G DEM" },
      ],
      tags: [
        "Izostazja Glacjalna",
        "Paleobatymetria",
        "Poziom Morza Holocenu",
        "Symulacja DEM",
      ],
    },
    {
      id: "viadrus-ai",
      tag: "04 / SATELITARNA OBSERWACJA ZIEMI",
      title: "Viadrus AI (Zwycięzca CASSINI UE)",
      subtitle:
        "1. Miejsce w Finale Europejskim — 11. Hackathon CASSINI (EUSPA) · Detekcja wycieków SAR",
      description:
        "Nagrodzony w Europie system teledetekcyjny łączący radarowe anomalie wilgotności dielektrycznej gruntu w paśmie C (Sentinel-1 SAR) oraz wielospektralne wskaźniki wegetacji i wody (Sentinel-2 NDVI/NDWI) z telemetrią hydrauliczną do wczesnej lokalizacji podziemnych wycieków wodociągowych.",
      metrics: [
        { label: "KATEGORIA", value: "Konkurs (1. Miejsce UE)" },
        { label: "TEMATYKA", value: "Inżynieria i Teledetekcja" },
        { label: "ŹRÓDŁA DANYCH", value: "Sentinel-1 SAR · Sentinel-2" },
      ],
      tags: [
        "Copernicus SAR",
        "Wilgotność Gruntu",
        "Nagroda EUSPA",
        "Telemetria Hydrauliczna",
      ],
      secondaryLabel: "Nagroda CASSINI",
    },
    {
      id: "golfstrom",
      tag: "05 / OCEANOGRAFIA FIZYCZNA I TERMODYNAMIKA",
      title: "Golfstrom — Północnoatlantycki Silnik Cieplny",
      subtitle:
        "Zonalne anomalie SST, baroklinowy front Prądu Zatokowego i transatlantycki kontrast klimatyczny",
      description:
        "Obserwatorium oceaniczno-atmosferyczne 3D obrazujące południkowy transport ~1 petawata energii cieplnej przez Golfsztrom i Prąd Północnoatlantycki. Zestawia klimat par miast na tych samych szerokościach geograficznych Ameryki Północnej i Europy z przekrojami batymetrycznymi do 5500 m.",
      metrics: [
        { label: "KATEGORIA", value: "Edukacyjny" },
        { label: "TEMATYKA", value: "Oceanografia i Klimat" },
        { label: "ŹRÓDŁA DANYCH", value: "NOAA OISST · ECMWF ERA5" },
      ],
      tags: [
        "Golfsztrom i AMOC",
        "Anomalia Zonalna",
        "Przekrój Batymetryczny",
        "Reanaliza ERA5",
      ],
    },
    {
      id: "polis-io",
      tag: "06 / HISTORIA OBLICZENIOWA I GEOSYMULACJA",
      title: "Polis — Geosymulacja Hellady Archaicznej (600 p.n.e.)",
      subtitle:
        "Kolonizacja komórkowa zależna od rzeźby terenu, pojemność troficzna i morskie sieci handlowe",
      description:
        "Agentowa geosymulacja geopolityczna i demograficzna na rastrze wysokościowo-batymetrycznym 336 000 komórek (~0,63 km/piksel) basenu Morza Egejskiego. Modeluje 18 historycznych greckich polis rywalizujących poprzez dyfuzję osadniczą zależną od spadków terenu, alokację budżetu i szlaki morskie.",
      metrics: [
        { label: "KATEGORIA", value: "Symulacja Strategiczna" },
        { label: "TEMATYKA", value: "Historia Obliczeniowa i GIS" },
        { label: "ŹRÓDŁA DANYCH", value: "AWS Terrain · Natural Earth" },
      ],
      tags: [
        "Automaty Komórkowe",
        "Raster Terenu DEM",
        "Kliodynamika",
        "Grecja Archaiczna",
      ],
    },
  ]),

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
  teamRefsLabel: "PRASA I WYRÓŻNIENIA",
  teamFocusLabel: "Zadania",
  teamPrevAria: "Poprzedni członek zespołu",
  teamNextAria: "Następny członek zespołu",
  teamSelectAria: "Wybierz członka zespołu",
  carouselSlideAria: "Karta członka zespołu",
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
