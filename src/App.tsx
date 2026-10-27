import React, { useState } from 'react';
import { JournalProvider, useJournal } from './context/JournalContext';
import { Header, ActiveTab } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { GradesView } from './components/GradesView';
import { AttendanceView } from './components/AttendanceView';
import { TimetableView } from './components/TimetableView';
import { TerminarzView } from './components/TerminarzView';
import { MessagesView } from './components/MessagesView';
import { AnnouncementsView } from './components/AnnouncementsView';
import { AdminPanelView } from './components/AdminPanelView';
import { LoginModal } from './components/LoginModal';
import { AddGradeModal } from './components/AddGradeModal';
import { BookOpen, Shield, GraduationCap, Users, User, ArrowRight, Lock, Mail } from 'lucide-react';

import { BehaviorView } from './components/BehaviorView';
import { CleanLoginScreen } from './components/CleanLoginScreen';
import { InitialSetupWizard } from './components/InitialSetupWizard';
import { ShieldAlert } from 'lucide-react';

function JournalApp() {
  const { currentUser, users, loginAs, logout, systemConfig, isLoadingServerState } = useJournal();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [addGradeModalOpen, setAddGradeModalOpen] = useState(false);

  // While contacting server database to verify school initialization state
  if (isLoadingServerState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#061121] via-[#0c2340] to-[#12365e] flex flex-col items-center justify-center p-4 text-white font-sans selection:bg-amber-400">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/25 border border-blue-400/30 animate-pulse">
            <BookOpen className="w-8 h-8 text-amber-300" />
          </div>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white mb-2">Dziennik Szkolny EduSynergia</h1>
        <p className="text-xs text-slate-400 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping inline-block" />
          <span>Synchronizacja z centralną bazą szkoły...</span>
        </p>
      </div>
    );
  }

  // If system is not initialized, show the initial school & admin setup wizard
  // Once initialized on ANY device (e.g. laptop), isInitialized is stored on the server.
  // Any other device (e.g. phone) receives isInitialized = true from server,
  // completely bypassing this wizard and displaying ONLY the Login Screen!
  if (!systemConfig.isInitialized) {
    return <InitialSetupWizard />;
  }

  if (!currentUser) {
    return <CleanLoginScreen />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top institution and tab navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogin={() => setLoginModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            setActiveTab={setActiveTab}
            onOpenAddGrade={() => setAddGradeModalOpen(true)}
          />
        )}
        {activeTab === 'grades' && <GradesView />}
        {activeTab === 'rollcall' && <AttendanceView initialTab="rollcall" />}
        {activeTab === 'attendance' && <AttendanceView initialTab="grid" />}
        {activeTab === 'behavior' && <BehaviorView />}
        {activeTab === 'timetable' && <TimetableView />}
        {activeTab === 'schedule' && <TerminarzView />}
        {activeTab === 'messages' && <MessagesView />}
        {activeTab === 'announcements' && <AnnouncementsView />}
        {activeTab === 'admin' && (
          currentUser.role === 'admin' ? (
            <AdminPanelView />
          ) : (
            <div className="bg-white rounded-2xl border border-red-200 p-8 text-center max-w-md mx-auto my-12 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-200">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-1.5">Brak uprawnień administratora</h2>
              <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                Jesteś zalogowany jako <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.roleTitle}).
                Dostęp do panelu dyrekcji i administracji jest ściśle chroniony i wymaga autoryzowanego konta Administratora Placówki.
              </p>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Wróć do Biurka
              </button>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-center md:text-left">
            <div className="w-7 h-7 rounded-lg bg-[#0b192c] text-amber-300 flex items-center justify-center font-bold text-xs shadow-2xs">
              ES
            </div>
            <div>
              <div className="font-bold text-slate-800">
                EduSynergia · {systemConfig.schoolName} ({systemConfig.schoolCity})
              </div>
              <div className="text-[11px] text-slate-400">
                Własny elektroniczny dziennik lekcyjny · Oceny, frekwencja, punkty zachowania, plan lekcji i panel dyrekcji
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Secure Session Info */}
            <div className="flex items-center space-x-3 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs shadow-2xs">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-slate-600 font-medium">
                  Zalogowano jako: <strong className="text-slate-900">{currentUser.name}</strong> ({currentUser.roleTitle})
                </span>
              </div>
              <button
                onClick={logout}
                className="text-rose-600 hover:text-rose-800 font-bold text-[11px] transition-colors ml-2 cursor-pointer"
              >
                Wyloguj się
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
      <AddGradeModal
        isOpen={addGradeModalOpen}
        onClose={() => setAddGradeModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <JournalProvider>
      <JournalApp />
    </JournalProvider>
  );
}
