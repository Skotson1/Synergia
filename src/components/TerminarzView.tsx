import React, { useState } from 'react';
import { useJournal } from '../context/JournalContext';
import { HomeworkTask, HomeworkType } from '../types';
import { LESSON_BELLS, ALL_SCHOOL_CLASSES } from '../data/initialData';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  BookOpen,
  Compass,
  Ticket,
  Award,
  Bell,
  PartyPopper,
  Users,
  FileText,
  CheckCircle,
  MapPin,
  User,
  GraduationCap,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';

interface TypeConfigItem {
  label: string;
  shortLabel: string;
  badge: string;
  bgLight: string;
  border: string;
  textDark: string;
  dotColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const EVENT_TYPE_CONFIG: Record<HomeworkType, TypeConfigItem> = {
  sprawdzian: {
    label: 'Sprawdzian / Klasówka',
    shortLabel: 'Sprawdzian',
    badge: 'bg-rose-100 text-rose-800 border-rose-300',
    bgLight: 'bg-rose-50/70',
    border: 'border-rose-200',
    textDark: 'text-rose-950',
    dotColor: 'bg-rose-600',
    icon: FileText,
  },
  kartkowka: {
    label: 'Kartkówka',
    shortLabel: 'Kartkówka',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    bgLight: 'bg-emerald-50/70',
    border: 'border-emerald-200',
    textDark: 'text-emerald-950',
    dotColor: 'bg-emerald-600',
    icon: FileText,
  },
  zadanie_domowe: {
    label: 'Zadanie domowe',
    shortLabel: 'Zadanie',
    badge: 'bg-amber-100 text-amber-800 border-amber-300',
    bgLight: 'bg-amber-50/70',
    border: 'border-amber-200',
    textDark: 'text-amber-950',
    dotColor: 'bg-amber-600',
    icon: BookOpen,
  },
  projekt: {
    label: 'Projekt edukacyjny',
    shortLabel: 'Projekt',
    badge: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    bgLight: 'bg-indigo-50/70',
    border: 'border-indigo-200',
    textDark: 'text-indigo-950',
    dotColor: 'bg-indigo-600',
    icon: Layers,
  },
  wycieczka: {
    label: 'Wycieczka szkolna',
    shortLabel: 'Wycieczka',
    badge: 'bg-orange-100 text-orange-900 border-orange-300',
    bgLight: 'bg-orange-50/70',
    border: 'border-orange-200',
    textDark: 'text-orange-950',
    dotColor: 'bg-orange-600',
    icon: Compass,
  },
  wyjscie_klasowe: {
    label: 'Wyjście klasowe (kino / teatr / muzeum)',
    shortLabel: 'Wyjście klasowe',
    badge: 'bg-purple-100 text-purple-900 border-purple-300',
    bgLight: 'bg-purple-50/70',
    border: 'border-purple-200',
    textDark: 'text-purple-950',
    dotColor: 'bg-purple-600',
    icon: Ticket,
  },
  uroczystosc_apel: {
    label: 'Uroczystość / Apel szkolny',
    shortLabel: 'Apel / Uroczystość',
    badge: 'bg-blue-100 text-blue-900 border-blue-300',
    bgLight: 'bg-blue-50/70',
    border: 'border-blue-200',
    textDark: 'text-blue-950',
    dotColor: 'bg-blue-600',
    icon: Bell,
  },
  konkurs: {
    label: 'Konkurs / Olimpiada',
    shortLabel: 'Konkurs',
    badge: 'bg-yellow-100 text-yellow-900 border-yellow-400',
    bgLight: 'bg-yellow-50/70',
    border: 'border-yellow-200',
    textDark: 'text-yellow-950',
    dotColor: 'bg-yellow-600',
    icon: Award,
  },
  wydarzenie: {
    label: 'Wydarzenie / Dyskoteka / Akcja',
    shortLabel: 'Wydarzenie',
    badge: 'bg-pink-100 text-pink-900 border-pink-300',
    bgLight: 'bg-pink-50/70',
    border: 'border-pink-200',
    textDark: 'text-pink-950',
    dotColor: 'bg-pink-600',
    icon: PartyPopper,
  },
  zebranie_rodzice: {
    label: 'Zebranie z rodzicami / Wywiadówka',
    shortLabel: 'Zebranie z rodzicami',
    badge: 'bg-teal-100 text-teal-900 border-teal-300',
    bgLight: 'bg-teal-50/70',
    border: 'border-teal-200',
    textDark: 'text-teal-950',
    dotColor: 'bg-teal-600',
    icon: Users,
  },
  inne: {
    label: 'Inne wydarzenie',
    shortLabel: 'Inne',
    badge: 'bg-slate-100 text-slate-800 border-slate-300',
    bgLight: 'bg-slate-50',
    border: 'border-slate-200',
    textDark: 'text-slate-900',
    dotColor: 'bg-slate-500',
    icon: Calendar,
  },
};

const MONTH_NAMES_PL = [
  'Styczeń',
  'Luty',
  'Marzec',
  'Kwiecień',
  'Maj',
  'Czerwiec',
  'Lipiec',
  'Sierpień',
  'Wrzesień',
  'Październik',
  'Listopad',
  'Grudzień',
];

const WEEKDAY_NAMES_PL = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'];

export const TerminarzView: React.FC = () => {
  const { homework, currentUser, subjects, addHomework, deleteHomework } = useJournal();

  // Reference date: current actual system date (or default 2026-10)
  const initialDate = new Date();
  const [currentYear, setCurrentYear] = useState<number>(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(initialDate.getMonth()); // 0-indexed

  // Filters & Views
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterClass, setFilterClass] = useState<string>('all');

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<HomeworkTask | null>(null);
  const [dayDetailModalDate, setDayDetailModalDate] = useState<string | null>(null);

  // Form states for adding task/event
  const [taskSubject, setTaskSubject] = useState('Matematyka');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDueDate, setTaskDueDate] = useState<string>(() => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${initialDate.getFullYear()}-${pad(initialDate.getMonth() + 1)}-${pad(initialDate.getDate())}`;
  });
  const [taskLessonHour, setTaskLessonHour] = useState<number>(0); // 0 = all-day / full-day
  const [taskClass, setTaskClass] = useState('4A');
  const [taskType, setTaskType] = useState<HomeworkType>('sprawdzian');
  const [taskLocation, setTaskLocation] = useState('');
  const [taskTeacher, setTaskTeacher] = useState(currentUser?.name || 'mgr Tomasz Kowalczyk');

  const isTeacherOrAdmin = currentUser?.role === 'admin' || currentUser?.role === 'teacher';

  // Navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
  };

  // Open add modal prefilled with specific date
  const handleOpenAddForDate = (dateStr: string) => {
    setTaskDueDate(dateStr);
    setAddModalOpen(true);
  };

  // Filter tasks based on selected filters
  const filteredTasks = homework.filter(task => {
    const matchesType = filterType === 'all' || task.type === filterType;
    const matchesClass =
      filterClass === 'all' ||
      task.className === filterClass ||
      task.className === 'Wszystkie oddziały' ||
      task.className === 'Cała szkoła';
    return matchesType && matchesClass;
  });

  // Calendar Grid generation (6 rows = 42 cells)
  const calendarCells = React.useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    // Polish calendar: Monday is 0, Sunday is 6
    const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const todayStr = (() => {
      const d = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    })();

    const cells: Array<{
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      isWeekend: boolean;
      tasks: HomeworkTask[];
    }> = [];

    const pad = (n: number) => String(n).padStart(2, '0');

    // Prev month trailing days
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevMonthIdx = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${prevYear}-${pad(prevMonthIdx + 1)}-${pad(dayNum)}`;
      const dayOfWeekIdx = (cells.length % 7);
      cells.push({
        dateStr,
        dayNumber: dayNum,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        isWeekend: dayOfWeekIdx === 5 || dayOfWeekIdx === 6,
        tasks: filteredTasks.filter(t => t.dueDate === dateStr),
      });
    }

    // Current month days
    for (let dayNum = 1; dayNum <= daysInCurrentMonth; dayNum++) {
      const dateStr = `${currentYear}-${pad(currentMonth + 1)}-${pad(dayNum)}`;
      const dayOfWeekIdx = (cells.length % 7);
      cells.push({
        dateStr,
        dayNumber: dayNum,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        isWeekend: dayOfWeekIdx === 5 || dayOfWeekIdx === 6,
        tasks: filteredTasks.filter(t => t.dueDate === dateStr),
      });
    }

    // Next month leading days to complete 42 cells
    let nextDayNum = 1;
    while (cells.length < 42) {
      const nextMonthIdx = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${nextYear}-${pad(nextMonthIdx + 1)}-${pad(nextDayNum)}`;
      const dayOfWeekIdx = (cells.length % 7);
      cells.push({
        dateStr,
        dayNumber: nextDayNum,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        isWeekend: dayOfWeekIdx === 5 || dayOfWeekIdx === 6,
        tasks: filteredTasks.filter(t => t.dueDate === dateStr),
      });
      nextDayNum++;
    }

    return cells;
  }, [currentYear, currentMonth, filteredTasks]);

  // Form submit handler
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskDueDate) return;

    let hourLabel: string | undefined = undefined;
    if (taskLessonHour > 0) {
      const bell = LESSON_BELLS.find(b => b.hour === taskLessonHour);
      hourLabel = bell
        ? `Lekcja ${taskLessonHour} (${bell.start} - ${bell.end})`
        : `Lekcja ${taskLessonHour}`;
    } else {
      hourLabel = 'Wydarzenie całodniowe / poza lekcjami';
    }

    addHomework({
      subjectName: taskSubject.trim() || 'Ogólne',
      title: taskTitle.trim(),
      description: taskDesc.trim(),
      dueDate: taskDueDate,
      lessonHour: taskLessonHour > 0 ? taskLessonHour : undefined,
      lessonHourLabel: hourLabel,
      className: taskClass,
      teacherName: taskTeacher.trim() || currentUser?.name || 'Nauczyciel',
      type: taskType,
      location: taskLocation.trim() || undefined,
    });

    setAddModalOpen(false);
    setTaskTitle('');
    setTaskDesc('');
    setTaskLocation('');
  };

  // Selected date events for Day Details Modal
  const dayDetailTasks = dayDetailModalDate
    ? filteredTasks.filter(t => t.dueDate === dayDetailModalDate)
    : [];

  return (
    <div className="space-y-5">
      {/* Top Banner / Synergia Header */}
      <div className="bg-gradient-to-r from-[#0b192c] via-[#152e4d] to-[#1e3a8a] text-white p-4 sm:p-5 rounded-2xl shadow-sm border border-blue-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 font-black flex items-center justify-center shadow-md shrink-0">
            <Calendar className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                Terminarz Szkolny & Kalendarz Wydarzeń
              </h2>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-amber-300 font-bold">
                Miesiąc: {MONTH_NAMES_PL[currentMonth]} {currentYear}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Sprawdziany, kartkówki, wycieczki, wyjścia klasowe, apele i zadania domowe w przejrzystym widoku całego miesiąca.
            </p>
          </div>
        </div>

        {/* View Mode & Add Action */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
          <div className="flex items-center bg-white/10 p-1 rounded-xl text-xs">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Miesiąc (Kalendarz)
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Lista (Agenda)
            </button>
          </div>

          {isTeacherOrAdmin && (
            <button
              onClick={() => {
                setTaskDueDate(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-15`);
                setAddModalOpen(true);
              }}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black rounded-xl flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer active:scale-98"
            >
              <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
              <span>Zaplanuj wydarzenie</span>
            </button>
          )}
        </div>
      </div>

      {/* Month Navigation & Filters Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Month / Year Navigator Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-white rounded-lg text-slate-700 transition-colors cursor-pointer"
              title="Poprzedni miesiąc"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-white rounded-lg transition-colors cursor-pointer"
            >
              Dzisiaj
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-white rounded-lg text-slate-700 transition-colors cursor-pointer"
              title="Następny miesiąc"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Month Selector Dropdown */}
          <select
            value={currentMonth}
            onChange={e => setCurrentMonth(Number(e.target.value))}
            className="text-xs font-bold text-[#1a365d] bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
          >
            {MONTH_NAMES_PL.map((name, idx) => (
              <option key={idx} value={idx}>
                {name}
              </option>
            ))}
          </select>

          {/* Year Selector Dropdown */}
          <select
            value={currentYear}
            onChange={e => setCurrentYear(Number(e.target.value))}
            className="text-xs font-bold text-[#1a365d] bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
          >
            {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map(yr => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>

          <span className="text-xs font-bold text-slate-500 pl-1 hidden sm:inline">
            ({filteredTasks.length} zaplanowanych wpisów)
          </span>
        </div>

        {/* Category & Class Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Kategoria:
            </span>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
            >
              <option value="all">Wszystkie rodzaje</option>
              <option value="sprawdzian">Sprawdziany</option>
              <option value="kartkowka">Kartkówki</option>
              <option value="wycieczka">Wycieczki szkolne</option>
              <option value="wyjscie_klasowe">Wyjścia klasowe (kino/teatr)</option>
              <option value="uroczystosc_apel">Apele i uroczystości</option>
              <option value="projekt">Projekty edukacyjne</option>
              <option value="konkurs">Konkursy i olimpiady</option>
              <option value="zebranie_rodzice">Zebrania z rodzicami</option>
              <option value="zadanie_domowe">Zadania domowe</option>
              <option value="wydarzenie">Wydarzenia / Dyskoteki</option>
              <option value="inne">Inne</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Oddział:
            </span>
            <select
              value={filterClass}
              onChange={e => setFilterClass(e.target.value)}
              className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1a365d]"
            >
              <option value="all">Wszystkie klasy</option>
              <option value="Wszystkie oddziały">Ogólnoszkolne</option>
              {ALL_SCHOOL_CLASSES.map(cls => (
                <option key={cls} value={cls}>
                  Klasa {cls}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Categories Color Legend Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-2 text-[11px]">
        <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider mr-1">
          Legenda:
        </span>
        {(Object.keys(EVENT_TYPE_CONFIG) as HomeworkType[]).map(typeKey => {
          const cfg = EVENT_TYPE_CONFIG[typeKey];
          const IconComp = cfg.icon;
          return (
            <button
              key={typeKey}
              onClick={() => setFilterType(filterType === typeKey ? 'all' : typeKey)}
              className={`px-2 py-0.5 rounded-md border flex items-center space-x-1 transition-all cursor-pointer ${
                filterType === typeKey
                  ? `${cfg.badge} font-bold ring-1 ring-slate-400`
                  : `${cfg.bgLight} ${cfg.textDark} ${cfg.border} hover:opacity-80`
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotColor}`} />
              <span>{cfg.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          VIEW 1: FULL MONTH CALENDAR GRID
         ========================================================================= */}
      {viewMode === 'calendar' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 bg-[#1a365d] text-white text-center font-bold text-xs py-2.5 border-b border-[#152e4d]">
            {WEEKDAY_NAMES_PL.map((wd, index) => (
              <div
                key={wd}
                className={`py-0.5 ${index === 5 || index === 6 ? 'text-amber-300' : ''}`}
              >
                {wd}
              </div>
            ))}
          </div>

          {/* 42 Calendar Cells (6 rows x 7 cols) */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 bg-slate-100">
            {calendarCells.map((cell, idx) => {
              const hasEvents = cell.tasks.length > 0;
              return (
                <div
                  key={idx}
                  className={`min-h-[105px] sm:min-h-[120px] p-1.5 sm:p-2 flex flex-col justify-between transition-colors relative group ${
                    !cell.isCurrentMonth
                      ? 'bg-slate-50/60 text-slate-400'
                      : cell.isWeekend
                      ? 'bg-slate-50/40 text-slate-700'
                      : 'bg-white text-slate-800'
                  } ${cell.isToday ? 'ring-2 ring-blue-600 ring-inset bg-blue-50/30' : ''}`}
                >
                  {/* Cell Day Header */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-black px-1.5 py-0.5 rounded-md ${
                        cell.isToday
                          ? 'bg-[#1a365d] text-white shadow-xs'
                          : cell.isCurrentMonth
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    {/* "+" Add Event directly to this date */}
                    {isTeacherOrAdmin && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleOpenAddForDate(cell.dateStr);
                        }}
                        className="opacity-0 group-hover:opacity-100 hover:opacity-100 p-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-md transition-all shadow-xs cursor-pointer"
                        title={`Dodaj sprawdzian/wydarzenie na dzień ${cell.dateStr}`}
                      >
                        <Plus className="w-3 h-3 stroke-[3]" />
                      </button>
                    )}
                  </div>

                  {/* Cell Events List */}
                  <div className="space-y-1 my-1 flex-1 overflow-hidden">
                    {cell.tasks.slice(0, 3).map(task => {
                      const cfg = EVENT_TYPE_CONFIG[task.type] || EVENT_TYPE_CONFIG['inne'];
                      const IconComp = cfg.icon;
                      return (
                        <div
                          key={task.id}
                          onClick={() => setSelectedEvent(task)}
                          className={`px-1.5 py-1 rounded text-[10px] font-semibold border truncate cursor-pointer transition-transform hover:scale-[1.02] flex items-center space-x-1 ${cfg.badge} shadow-2xs`}
                          title={`${task.title} (${task.subjectName}, kl. ${task.className})`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dotColor}`} />
                          <span className="truncate">
                            {task.lessonHour ? `g.${task.lessonHour}: ` : ''}
                            {task.title}
                          </span>
                        </div>
                      );
                    })}

                    {cell.tasks.length > 3 && (
                      <button
                        onClick={() => setDayDetailModalDate(cell.dateStr)}
                        className="text-[10px] font-bold text-blue-700 hover:underline block text-left pt-0.5"
                      >
                        + {cell.tasks.length - 3} więcej...
                      </button>
                    )}
                  </div>

                  {/* Bottom Day Info indicator */}
                  {hasEvents && (
                    <div
                      onClick={() => setDayDetailModalDate(cell.dateStr)}
                      className="text-[9px] text-slate-400 hover:text-slate-700 cursor-pointer pt-0.5 truncate flex items-center justify-between"
                    >
                      <span className="truncate">Wydarzeń: {cell.tasks.length}</span>
                      <span className="text-blue-600 font-bold hover:underline">Podgląd ›</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* =========================================================================
            VIEW 2: CHRONOLOGICAL LIST / AGENDA VIEW
           ========================================================================= */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.length === 0 ? (
            <div className="col-span-2 p-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
              <Calendar className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <div className="font-bold text-slate-700">Brak wydarzeń w wybranym filtrze.</div>
              <p className="text-[11px] text-slate-500 mt-1">
                Zmień kategorię lub oddział, albo kliknij „Zaplanuj wydarzenie”, aby dodać nowy wpis.
              </p>
            </div>
          ) : (
            filteredTasks.map(task => {
              const cfg = EVENT_TYPE_CONFIG[task.type] || EVENT_TYPE_CONFIG['inne'];
              const IconComp = cfg.icon;
              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedEvent(task)}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border flex items-center space-x-1 ${cfg.badge}`}
                      >
                        <IconComp className="w-3 h-3" />
                        <span>{cfg.shortLabel}</span>
                      </span>

                      <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{task.dueDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-xs font-bold text-[#1a365d]">
                      <span>{task.subjectName}</span>
                      <span>·</span>
                      <span className="text-slate-500 font-semibold">Oddział: {task.className}</span>
                    </div>

                    <h3 className="text-sm font-black text-slate-900 mt-1 leading-snug group-hover:text-blue-900 transition-colors">
                      {task.title}
                    </h3>

                    {task.lessonHourLabel && (
                      <div className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 mt-2">
                        <Clock className="w-3 h-3 text-amber-700" />
                        <span>{task.lessonHourLabel}</span>
                      </div>
                    )}

                    {task.location && (
                      <div className="inline-flex items-center space-x-1 text-[11px] text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 ml-2 mt-2">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{task.location}</span>
                      </div>
                    )}

                    <p className="text-xs text-slate-600 mt-2.5 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                      {task.description || 'Brak dodatkowego opisu.'}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center space-x-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{task.teacherName}</span>
                    </span>

                    {isTeacherOrAdmin && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          deleteHomework(task.id);
                        }}
                        className="text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Usuń wpis z terminarza"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* =========================================================================
          MODAL 1: ADD EVENT MODAL (Kompletny formularz z datą, lekcją, przedmiotem)
         ========================================================================= */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 max-h-[92vh] flex flex-col">
            <div className="bg-[#1a365d] text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <h3 className="text-base font-black">Dodaj nowe wydarzenie do terminarza</h3>
                  <p className="text-[11px] text-slate-300">
                    Wybierz rodzaj wydarzenia, dokładną datę, numer lekcji oraz oddział
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAddModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs overflow-y-auto">
              {/* Category / Type Selector */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Rodzaj wydarzenia <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(Object.keys(EVENT_TYPE_CONFIG) as HomeworkType[]).map(typeKey => {
                    const cfg = EVENT_TYPE_CONFIG[typeKey];
                    const IconComp = cfg.icon;
                    const isSelected = taskType === typeKey;
                    return (
                      <button
                        key={typeKey}
                        type="button"
                        onClick={() => setTaskType(typeKey)}
                        className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1a365d] text-white border-[#1a365d] shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                        }`}
                      >
                        <IconComp
                          className={`w-4 h-4 shrink-0 ${
                            isSelected ? 'text-amber-300' : 'text-slate-500'
                          }`}
                        />
                        <span className="font-bold text-[11px] truncate">{cfg.shortLabel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title input */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tytuł wydarzenia / Nazwa <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  placeholder="np. Sprawdzian: Rachunek prawdopodobieństwa / Wyjście do Teatru"
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-50 font-bold text-slate-900"
                />
              </div>

              {/* Date & Lesson Hour Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-blue-50/50 p-3.5 rounded-xl border border-blue-200">
                {/* Date Picker */}
                <div>
                  <label className="block font-bold text-blue-950 mb-1 flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-700" />
                    <span>Data wydarzenia (dzień, miesiąc, rok) <span className="text-red-500">*</span></span>
                  </label>
                  <input
                    type="date"
                    required
                    value={taskDueDate}
                    onChange={e => setTaskDueDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white font-bold text-slate-900"
                  />
                </div>

                {/* Na której lekcji (Lesson Hour) */}
                <div>
                  <label className="block font-bold text-blue-950 mb-1 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-blue-700" />
                    <span>Na której lekcji?</span>
                  </label>
                  <select
                    value={taskLessonHour}
                    onChange={e => setTaskLessonHour(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white font-semibold text-slate-800"
                  >
                    <option value={0}>Wydarzenie całodniowe / poza lekcjami</option>
                    {LESSON_BELLS.map(bell => (
                      <option key={bell.hour} value={bell.hour}>
                        Lekcja {bell.hour} ({bell.start} - {bell.end})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject, Class, Location Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Przedmiot / Kategoria</label>
                  <select
                    value={taskSubject}
                    onChange={e => setTaskSubject(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white font-semibold text-slate-800"
                  >
                    <option value="Ogólne / Wychowawcze">Ogólne / Wychowawcze</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                    <option value="Wychowanie fizyczne">Wychowanie fizyczne</option>
                    <option value="Plastyka">Plastyka</option>
                    <option value="Muzyka">Muzyka</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Oddział / Klasa</label>
                  <select
                    value={taskClass}
                    onChange={e => setTaskClass(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white font-semibold text-slate-800"
                  >
                    <option value="Wszystkie oddziały">Wszystkie oddziały (Cała szkoła)</option>
                    <optgroup label="Szkoła Podstawowa 4–8">
                      {ALL_SCHOOL_CLASSES.filter(c => /^[4-8][A-Z]$/.test(c)).map(cls => (
                        <option key={cls} value={cls}>
                          Klasa {cls}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Szkoła Podstawowa 1–3">
                      {ALL_SCHOOL_CLASSES.filter(c => /^[1-3][A-Z]$/.test(c)).map(cls => (
                        <option key={cls} value={cls}>
                          Klasa {cls}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Szkoły ponadpodstawowe">
                      {ALL_SCHOOL_CLASSES.filter(c => /^[1-5][L|T]$/.test(c)).map(cls => (
                        <option key={cls} value={cls}>
                          Klasa {cls}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Miejsce (opcjonalnie)</label>
                  <input
                    type="text"
                    value={taskLocation}
                    onChange={e => setTaskLocation(e.target.value)}
                    placeholder="np. Sala 2, Kino, Aula"
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              {/* Teacher in charge */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Prowadzący / Nauczyciel</label>
                <input
                  type="text"
                  required
                  value={taskTeacher}
                  onChange={e => setTaskTeacher(e.target.value)}
                  placeholder="np. mgr Tomasz Kowalczyk"
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Szczegółowy opis, instrukcje i wytyczne
                </label>
                <textarea
                  rows={3}
                  value={taskDesc}
                  onChange={e => setTaskDesc(e.target.value)}
                  placeholder="Zakres materiału, zbiórka, potrzebne materiały, legitymacja, wytyczne..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-white leading-relaxed"
                />
              </div>

              {/* Form buttons */}
              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold cursor-pointer"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-[#1a365d] hover:bg-[#152c4d] text-white rounded-lg flex items-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4 text-amber-300" />
                  <span>Zapisz w terminarzu</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: EVENT DETAILS MODAL (Podgląd wybranego wpisu)
         ========================================================================= */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            {/* Modal Header */}
            {(() => {
              const cfg = EVENT_TYPE_CONFIG[selectedEvent.type] || EVENT_TYPE_CONFIG['inne'];
              const IconComp = cfg.icon;
              return (
                <div className="bg-[#1a365d] text-white px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span
                      className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-md border flex items-center space-x-1 ${cfg.badge}`}
                    >
                      <IconComp className="w-3.5 h-3.5" />
                      <span>{cfg.label}</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-slate-300 hover:text-white p-1 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              );
            })()}

            <div className="p-6 space-y-4 text-xs">
              <div>
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                  {selectedEvent.subjectName} · Oddział: {selectedEvent.className}
                </span>
                <h2 className="text-lg font-black text-slate-900 mt-0.5 leading-snug">
                  {selectedEvent.title}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Termin / Data:
                  </span>
                  <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-700" />
                    <span>{selectedEvent.dueDate}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Czas / Godzina:
                  </span>
                  <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>{selectedEvent.lessonHourLabel || 'Cały dzień'}</span>
                  </div>
                </div>

                {selectedEvent.location && (
                  <div className="space-y-1 col-span-2 pt-1 border-t border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Lokalizacja / Miejsce:
                    </span>
                    <div className="font-semibold text-slate-800 flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-600" />
                      <span>{selectedEvent.location}</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <span className="block font-bold text-slate-700 mb-1 uppercase text-[10px] tracking-wider">
                  Opis i wytyczne:
                </span>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {selectedEvent.description || 'Brak dodatkowego opisu.'}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                <span>Nauczyciel: <strong>{selectedEvent.teacherName}</strong></span>

                <div className="flex items-center space-x-2">
                  {isTeacherOrAdmin && (
                    <button
                      onClick={() => {
                        deleteHomework(selectedEvent.id);
                        setSelectedEvent(null);
                      }}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Usuń wpis</span>
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold cursor-pointer"
                  >
                    Zamknij
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: DAY DETAILS MODAL (Wszystkie wydarzenia z wybranego dnia)
         ========================================================================= */}
      {dayDetailModalDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-[#1a365d] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Calendar className="w-5 h-5 text-amber-300" />
                <div>
                  <h3 className="text-base font-black">Plan dnia: {dayDetailModalDate}</h3>
                  <p className="text-[11px] text-slate-300">
                    Wszystkie zaplanowane sprawdziany i wydarzenia
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDayDetailModalDate(null)}
                className="text-slate-300 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3 text-xs max-h-[70vh] overflow-y-auto">
              {dayDetailTasks.length === 0 ? (
                <div className="text-center py-6 text-slate-400">
                  Brak zaplanowanych wydarzeń na ten dzień.
                </div>
              ) : (
                dayDetailTasks.map(task => {
                  const cfg = EVENT_TYPE_CONFIG[task.type] || EVENT_TYPE_CONFIG['inne'];
                  const IconComp = cfg.icon;
                  return (
                    <div
                      key={task.id}
                      onClick={() => {
                        setDayDetailModalDate(null);
                        setSelectedEvent(task);
                      }}
                      className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer flex flex-col justify-between space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border flex items-center space-x-1 ${cfg.badge}`}
                        >
                          <IconComp className="w-3 h-3" />
                          <span>{cfg.shortLabel}</span>
                        </span>
                        <span className="text-[11px] font-bold text-slate-600">
                          {task.lessonHourLabel || 'Cały dzień'}
                        </span>
                      </div>

                      <div>
                        <div className="text-[11px] font-bold text-blue-900">{task.subjectName}</div>
                        <div className="text-sm font-bold text-slate-900">{task.title}</div>
                        {task.description && (
                          <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {task.description}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200">
                        <span>Klasa: {task.className}</span>
                        <span>{task.teacherName}</span>
                      </div>
                    </div>
                  );
                })
              )}

              <div className="pt-2 flex items-center justify-between">
                {isTeacherOrAdmin && (
                  <button
                    onClick={() => {
                      const d = dayDetailModalDate;
                      setDayDetailModalDate(null);
                      handleOpenAddForDate(d);
                    }}
                    className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Dodaj na ten dzień</span>
                  </button>
                )}

                <button
                  onClick={() => setDayDetailModalDate(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold ml-auto cursor-pointer"
                >
                  Zamknij
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
