import { TimetableLesson } from '../types';
import { LESSON_BELLS } from '../data/initialData';

export type Room = 'Sala 1' | 'Sala 2' | 'Sala 3' | 'Sala 4';

interface SubjectTemplate {
  name: string;
  teacher: string;
  room: Room;
  topics: string[];
}

// Simple seeded PRNG so a class always produces a consistent distinctive plan, but can be reshuffled
function createRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) + 1013;
}

// Grade 1-3: Early childhood education subjects
const EARLY_SUBJECTS: SubjectTemplate[] = [
  {
    name: 'Edukacja wczesnoszkolna - polonistyczna',
    teacher: 'mgr Danuta Kwiatkowska',
    room: 'Sala 1',
    topics: [
      'Poznajemy literkę i dwuznaki - głośne czytanie bajki o krasnoludkach',
      'Układamy zdania o wiośnie i przepisujemy do zeszytu w wąskie linie',
      'Opisujemy wiosenną łąkę - ćwiczenia w pięknym pisaniu i ortografii',
      'Czytanie ze zrozumieniem: opowiadanie o przygodach małego pieska',
    ],
  },
  {
    name: 'Edukacja wczesnoszkolna - matematyczna',
    teacher: 'mgr Danuta Kwiatkowska',
    room: 'Sala 2',
    topics: [
      'Dodawanie i odejmowanie w zakresie 20 z przekroczeniem progu dziesiątkowego',
      'Figury geometryczne: koło, kwadrat, prostokąt i trójkąt wokół nas',
      'Rozwiązywanie prostych zadań tekstowych z ilustracjami',
      'Mierzenie długości linijką i porównywanie wielkości przedmiotów',
    ],
  },
  {
    name: 'Edukacja wczesnoszkolna - przyrodnicza',
    teacher: 'mgr Danuta Kwiatkowska',
    room: 'Sala 3',
    topics: [
      'Wiosenne przebudzenie przyrody - pierwsze kwiaty i pąki na drzewach',
      'Ptaki powracające z ciepłych krajów - bociany i jaskółki',
      'Dbamy o czystość naszej planety: segregacja śmieci i recykling',
    ],
  },
  {
    name: 'Język angielski',
    teacher: 'mgr John Miller',
    room: 'Sala 3',
    topics: [
      'My family and home: piosenki i zabawy słowne w języku angielskim',
      'Colours, toys and numbers up to 20: interaktywne zgadywanki',
      'Animals on the farm: nazwy zwierząt i naśladowanie odgłosów',
    ],
  },
  {
    name: 'Edukacja informatyczna',
    teacher: 'mgr Tomasz Kowalczyk',
    room: 'Sala 2',
    topics: [
      'Zasady bezpiecznego korzystania z komputera i obsługa myszki',
      'Rysujemy wiosenny pejzaż w programie graficznym Paint',
      'Proste łamigłówki logiczne i sterowanie duszkiem w Scratch Junior',
    ],
  },
  {
    name: 'Wychowanie fizyczne',
    teacher: 'mgr Grzegorz Bąk',
    room: 'Sala 4',
    topics: [
      'Gry i zabawy bieżne: berki, sztafety i tory przeszkód',
      'Ćwiczenia gimnastyczne kształtujące prawidłową postawę ciała',
      'Zabawy z piłką - rzuty, chwyty i celowanie do kosza',
    ],
  },
  {
    name: 'Edukacja plastyczna i muzyczna',
    teacher: 'mgr Monika Wiśniewska',
    room: 'Sala 1',
    topics: [
      'Malowanie farbami plakatowymi: barwy ciepłe i zimne',
      'Nauka piosenki o wiośnie i wyklaskiwanie prostych rytmów',
      'Wycinanka z papieru kolorowego: wiosenne motyle i kwiaty',
    ],
  },
  {
    name: 'Zajęcia z wychowawcą',
    teacher: 'mgr Danuta Kwiatkowska',
    room: 'Sala 1',
    topics: [
      'Nasze klasowe zasady: wzajemny szacunek i pomoc koleżeńska',
      'Kulturalne zachowanie na przerwach i w stołówce szkolnej',
    ],
  },
];

// Grade 4-6: Intermediate subjects
const MID_SUBJECTS: SubjectTemplate[] = [
  {
    name: 'Język polski',
    teacher: 'mgr Anna Nowak',
    room: 'Sala 1',
    topics: [
      'Analiza lektury szkolnej i tworzenie charakterystyki bohatera',
      'Części mowy w praktyce: odmiana rzeczownika i przymiotnika',
      'Sztuka pisania opowiadania twórczego z dialogiem',
      'Zasady ortografii i interpunkcji - pisownia wyrazów z „ó” i „u”',
    ],
  },
  {
    name: 'Matematyka',
    teacher: 'mgr Tomasz Kowalczyk',
    room: 'Sala 2',
    topics: [
      'Działania na ułamkach zwykłych i dziesiętnych w zadaniach praktycznych',
      'Obliczanie pól i obwodów wielokątów - prostokąty i trójkąty',
      'Kolejność wykonywania działań i zadania z nawiasami',
      'Procenty w życiu codziennym: obniżki i podwyżki cen w sklepie',
    ],
  },
  {
    name: 'Język angielski',
    teacher: 'mgr John Miller',
    room: 'Sala 3',
    topics: [
      'Present Simple vs Present Continuous in daily communication',
      'Travel, holidays and shopping vocabulary practice',
      'Reading comprehension: interesting facts about English-speaking countries',
    ],
  },
  {
    name: 'Historia',
    teacher: 'mgr Piotr Adamski',
    room: 'Sala 1',
    topics: [
      'Polska pierwszych Piastów - chrzest Polski i koronacja Bolesława Chrobrego',
      'Średniowieczny zamek i obyczaje rycerskie w Europie',
      'Wielkie odkrycia geograficzne i ich wpływ na losy świata',
    ],
  },
  {
    name: 'Przyroda / Biologia',
    teacher: 'mgr Katarzyna Wróbel',
    room: 'Sala 4',
    topics: [
      'Strefy krajobrazowe Ziemi: klimat, roślinność i zwierzęta',
      'Budowa i funkcje komórki roślinnej i zwierzęcej pod mikroskopem',
      'Organizm człowieka: układ krążenia i higiena serca',
    ],
  },
  {
    name: 'Geografia',
    teacher: 'mgr Danuta Lis',
    room: 'Sala 4',
    topics: [
      'Praca z mapą hipsometryczną i wyznaczanie skali odległości',
      'Krajobrazy Polski: od Bałtyku po Tatry',
      'Zjawiska pogodowe i stacje meteorologiczne',
    ],
  },
  {
    name: 'Informatyka',
    teacher: 'mgr Tomasz Kowalczyk',
    room: 'Sala 2',
    topics: [
      'Algorytmy i tworzenie gry zręcznościowej w środowisku Scratch',
      'Formatowanie dokumentu tekstowego i wstawianie tabel',
      'Bezpieczne korzystanie z sieci i netykieta',
    ],
  },
  {
    name: 'Wychowanie fizyczne',
    teacher: 'mgr Grzegorz Bąk',
    room: 'Sala 4',
    topics: [
      'Gry zespołowe: kozłowanie, podania i rzuty z wyskoku w koszykówce',
      'Piłka siatkowa: odbicia sposobem górnym i dolnym, zagrywka',
      'Bieg na dystansie 60m i technika startu niskiego',
    ],
  },
  {
    name: 'Plastyka',
    teacher: 'mgr Monika Wiśniewska',
    room: 'Sala 1',
    topics: [
      'Perspektywa malarska: zbieżna i powietrzna w pejzażu',
      'Światłocień i studium martwej natury ołówkiem',
    ],
  },
  {
    name: 'Muzyka',
    teacher: 'mgr Monika Wiśniewska',
    room: 'Sala 3',
    topics: [
      'Polskie tańce narodowe: rytmy poloneza, mazura i krakowiaka',
      'Kompozytorzy epoki romantyzmu - życie i twórczość Fryderyka Chopina',
    ],
  },
  {
    name: 'Technika',
    teacher: 'dr inż. Marek Zając',
    room: 'Sala 2',
    topics: [
      'Zasady ruchu drogowego i przygotowanie do egzaminu na kartę rowerową',
      'Właściwości drewna, metalu i tworzyw sztucznych',
    ],
  },
  {
    name: 'Godzina z wychowawcą',
    teacher: 'mgr Tomasz Kowalczyk',
    room: 'Sala 2',
    topics: [
      'Budowanie zgranego zespołu klasowego i rozwiązywanie konfliktów',
      'Zarządzanie czasem i efektywne metody nauki przed sprawdzianem',
    ],
  },
];

// Grade 7-8: Senior primary subjects with Chemistry, Physics, Biology, German, WOS, EDB
const SENIOR_SUBJECTS: SubjectTemplate[] = [
  {
    name: 'Chemia',
    teacher: 'mgr Beata Lewandowska',
    room: 'Sala 3',
    topics: [
      'Budowa atomu, liczba atomowa i masowa oraz układ okresowy pierwiastków',
      'Reakcje utleniania i redukcji - bezpieczne doświadczenia laboratoryjne',
      'Wodorotlenki i kwasy: wskaźniki kwasowo-zasadowe i skala pH',
      'Sole: metody otrzymywania i reakcje zobojętniania',
    ],
  },
  {
    name: 'Fizyka',
    teacher: 'dr inż. Marek Zając',
    room: 'Sala 2',
    topics: [
      'Prawa dynamiki Newtona i ruch jednostajnie przyspieszony',
      'Praca, moc i energia mechaniczna w zjawiskach przyrodniczych',
      'Obwody elektryczne: prawo Ohma i łączenie oporników',
      'Optyka: odbicie i załamanie światła, soczewki skupiające',
    ],
  },
  {
    name: 'Biologia',
    teacher: 'mgr Katarzyna Wróbel',
    room: 'Sala 4',
    topics: [
      'Genetyka klasyczna: prawa dziedziczenia Mendla i krzyżówki genetyczne',
      'Budowa cząsteczki DNA i proces replikacji',
      'Ewolucja organizmów żywych i dowody ewolucji',
      'Ekologia: łańcuchy troficzne i ochrona bioróżnorodności',
    ],
  },
  {
    name: 'Geografia',
    teacher: 'mgr Danuta Lis',
    room: 'Sala 4',
    topics: [
      'Geografia regionalna świata: Azja, Afryka i Ameryka Północna',
      'Gospodarka Polski: przemysł, usługi i rolnictwo w Unii Europejskiej',
      'Procesy endogeniczne: trzęsienia ziemi, wulkanizm i ruchy płyt tektonicznych',
    ],
  },
  {
    name: 'Język polski',
    teacher: 'mgr Anna Nowak',
    room: 'Sala 1',
    topics: [
      'Adam Mickiewicz - „Dziady cz. II” i problematyka winy oraz kary',
      'Juliusz Słowacki - „Balladyna”: motyw władzy i zbrodni',
      'Rozprawka problemowa na egzamin ósmoklasisty - teza i argumentacja',
      'Słowotwórstwo: rodzina wyrazów, wyrazy pochodne i podstawowe',
    ],
  },
  {
    name: 'Matematyka',
    teacher: 'mgr Tomasz Kowalczyk',
    room: 'Sala 2',
    topics: [
      'Twierdzenie Pitagorasa i jego zastosowanie w geometrii płaskiej i przestrzennej',
      'Równania i układy równań pierwszego stopnia z dwiema niewiadomymi',
      'Pierwiastki i potęgi o wykładnikach całkowitych',
      'Stereometria: pole powierzchni i objętość graniastosłupów oraz ostrosłupów',
    ],
  },
  {
    name: 'Język angielski',
    teacher: 'mgr John Miller',
    room: 'Sala 3',
    topics: [
      'Past Simple vs Past Continuous and irregular verb forms',
      'Conditionals (Type 1 & 2): expressing wishes and possibilities',
      'Exam preparation: reading comprehension and short essay writing',
    ],
  },
  {
    name: 'Język niemiecki',
    teacher: 'mgr Ewa Schmidt',
    room: 'Sala 3',
    topics: [
      'Das Schulsystem in Deutschland: nawiązywanie kontaktów i słownictwo',
      'Czasowniki nieregularne i czas przeszły Perfekt w dialogach',
      'Opis planów na weekend i pytanie o drogę w niemieckim mieście',
    ],
  },
  {
    name: 'Historia',
    teacher: 'mgr Piotr Adamski',
    room: 'Sala 1',
    topics: [
      'I Wojna Światowa i odzyskanie niepodległości przez Polskę w 1918 roku',
      'Polska w okresie międzywojennym - reformy Grabskiego i budowa Gdyni',
      'II Wojna Światowa: kampania wrześniowa i Polskie Państwo Podziemne',
    ],
  },
  {
    name: 'Wiedza o społeczeństwie (WOS)',
    teacher: 'mgr Piotr Adamski',
    room: 'Sala 1',
    topics: [
      'Ustrój Rzeczypospolitej Polskiej: Sejm, Senat i Prezydent',
      'Prawa człowieka i mechanizmy ich ochrony na świecie',
      'Samorząd terytorialny: gmina, powiat i województwo',
    ],
  },
  {
    name: 'Edukacja dla bezpieczeństwa (EDB)',
    teacher: 'dr inż. Marek Zając',
    room: 'Sala 2',
    topics: [
      'Pierwsza pomoc przedmedyczna: resuscytacja krążeniowo-oddechowa (RKO)',
      'Postępowanie w sytuacjach zagrożeń kryzysowych i ewakuacja',
    ],
  },
  {
    name: 'Informatyka',
    teacher: 'mgr Tomasz Kowalczyk',
    room: 'Sala 2',
    topics: [
      'Wprowadzenie do programowania tekstowego w języku Python',
      'Arkusz kalkulacyjny Excel: formuły warunkowe JEŻELI i wykresy',
    ],
  },
  {
    name: 'Wychowanie fizyczne',
    teacher: 'mgr Grzegorz Bąk',
    room: 'Sala 4',
    topics: [
      'Piłka ręczna: technika rzutu z wyskoku i organizacja obrony strefowej',
      'Lekkoatletyka: skok w dal techniką naturalną i sztafety biegowe',
    ],
  },
  {
    name: 'Godzina z wychowawcą',
    teacher: 'mgr Anna Nowak',
    room: 'Sala 1',
    topics: [
      'Wybór dalszej ścieżki edukacyjnej: liceum, technikum czy szkoła branżowa',
      'Stres egzaminacyjny i techniki radzenia sobie z presją',
    ],
  },
];

// Helper to determine curriculum level from class name
export function getCurriculumGroup(className: string): 'early' | 'mid' | 'senior' | 'high' {
  const clean = className.trim().toUpperCase();
  const digitMatch = clean.match(/(\d+)/);

  if (digitMatch) {
    const num = parseInt(digitMatch[1], 10);
    if (num >= 1 && num <= 3 && !clean.includes('L') && !clean.includes('T')) return 'early';
    if (num >= 4 && num <= 6 && !clean.includes('L') && !clean.includes('T')) return 'mid';
    if ((num === 7 || num === 8) && !clean.includes('L') && !clean.includes('T')) return 'senior';
    if (num >= 1 && (clean.includes('L') || clean.includes('T') || num > 8)) return 'high';
  }

  // Fallback defaults
  if (clean.includes('1') || clean.includes('2') || clean.includes('3')) return 'early';
  if (clean.includes('7') || clean.includes('8')) return 'senior';
  return 'mid';
}

/**
 * Generates a realistic, complete, diversified weekly timetable for a given class.
 * - Distinct subject roster by grade group (Classes 1-3 get early ed, 4-6 get mid ed, 7-8 get Chemistry, Physics, Biology, German, WOS, EDB).
 * - Strictly utilizes rooms: Sala 1, Sala 2, Sala 3, Sala 4.
 * - Varied day lengths (e.g. 4, 5, 6, 7 hours) with varied start hours (08:00 or 08:55).
 * - Completely unique layout per class (different seed hash + optional random shuffle).
 */
export function generateClassTimetable(
  className: string,
  randomModifier: number = 0
): Array<Omit<TimetableLesson, 'id'>> {
  const seed = stringToSeed(className + '_' + randomModifier);
  const rand = createRandom(seed);

  const group = getCurriculumGroup(className);
  let pool: SubjectTemplate[];

  if (group === 'early') {
    pool = EARLY_SUBJECTS;
  } else if (group === 'senior' || group === 'high') {
    pool = SENIOR_SUBJECTS;
  } else {
    pool = MID_SUBJECTS;
  }

  // Define hours per day based on group
  // Mon-Fri length variations:
  let dayLengths: number[];
  let startHourOffsets: number[]; // 0 = starts at lesson 1 (08:00), 1 = starts at lesson 2 (08:55)

  if (group === 'early') {
    // 4 to 5 lessons per day
    dayLengths = [
      Math.floor(rand() * 2) + 4, // 4-5
      4,
      Math.floor(rand() * 2) + 4,
      4,
      4,
    ];
    // occasionally starts on 2nd hour (08:55)
    startHourOffsets = [0, rand() > 0.6 ? 1 : 0, 0, rand() > 0.7 ? 1 : 0, 0];
  } else if (group === 'senior' || group === 'high') {
    // 6 to 7 lessons per day, senior students have full schedules
    dayLengths = [
      Math.floor(rand() * 2) + 6, // 6-7
      Math.floor(rand() * 2) + 6,
      7,
      Math.floor(rand() * 2) + 6,
      Math.floor(rand() * 2) + 5, // 5-6
    ];
    startHourOffsets = [0, rand() > 0.65 ? 1 : 0, 0, 0, rand() > 0.7 ? 1 : 0];
  } else {
    // 5 to 6 lessons per day
    dayLengths = [
      Math.floor(rand() * 2) + 5, // 5-6
      5,
      Math.floor(rand() * 2) + 5,
      6,
      Math.floor(rand() * 2) + 4, // 4-5 on Friday
    ];
    startHourOffsets = [0, rand() > 0.6 ? 1 : 0, 0, 0, 0];
  }

  const generatedLessons: Array<Omit<TimetableLesson, 'id'>> = [];

  // Allowed rooms strictly restricted to Sala 1 - 4
  const ALLOWED_ROOMS: Room[] = ['Sala 1', 'Sala 2', 'Sala 3', 'Sala 4'];

  for (let dayNum = 1; dayNum <= 5; dayNum++) {
    const dayIndex = dayNum - 1;
    const count = dayLengths[dayIndex];
    const startHourOffset = startHourOffsets[dayIndex];

    // Pick subjects for this day with no consecutive duplicates
    const dayPool = [...pool];
    // Shuffle pool for this day
    for (let i = dayPool.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [dayPool[i], dayPool[j]] = [dayPool[j], dayPool[i]];
    }

    let lastSubject = '';
    for (let i = 0; i < count; i++) {
      const lessonHour = startHourOffset + i + 1;
      const bell = LESSON_BELLS.find(b => b.hour === lessonHour) || {
        hour: lessonHour,
        start: '08:00',
        end: '08:45',
      };

      // Select candidate subject not equal to lastSubject if possible
      let chosen = dayPool.find(p => p.name !== lastSubject);
      if (!chosen) {
        chosen = dayPool[i % dayPool.length];
      }
      lastSubject = chosen.name;

      // Pick a topic
      const topicIndex = Math.floor(rand() * chosen.topics.length);
      const topic = chosen.topics[topicIndex] || `Zajęcia dydaktyczne z przedmiotu ${chosen.name}`;

      // Room strictly between Sala 1 and Sala 4
      const room: Room = ALLOWED_ROOMS.includes(chosen.room)
        ? chosen.room
        : ALLOWED_ROOMS[Math.floor(rand() * ALLOWED_ROOMS.length)];

      generatedLessons.push({
        className,
        dayOfWeek: dayNum as 1 | 2 | 3 | 4 | 5,
        lessonHour,
        timeStart: bell.start,
        timeEnd: bell.end,
        subjectName: chosen.name,
        teacherName: chosen.teacher,
        classroom: room,
        groupName: 'cała klasa',
        lessonTopic: topic,
      });
    }
  }

  return generatedLessons;
}
