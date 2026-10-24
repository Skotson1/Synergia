import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data directory and database file
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'server-db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface ServerState {
  systemConfig: {
    isInitialized: boolean;
    schoolName: string;
    schoolCity: string;
    academicYear: string;
    semester: 1 | 2;
    adminName: string;
    adminEmail: string;
    initializedAt?: string;
  };
  users: any[];
  students: any[];
  grades: any[];
  attendance: any[];
  timetable: any[];
  messages: any[];
  announcements: any[];
  homework: any[];
  behaviorPoints: any[];
  lessonPlusMinus: any[];
  passwordResetRequests: any[];
  updatedAt: string;
}

const DEFAULT_SERVER_STATE: ServerState = {
  systemConfig: {
    isInitialized: false,
    schoolName: '',
    schoolCity: '',
    academicYear: '2025/2026',
    semester: 2,
    adminName: '',
    adminEmail: '',
  },
  users: [],
  students: [],
  grades: [],
  attendance: [],
  timetable: [],
  messages: [],
  announcements: [],
  homework: [],
  behaviorPoints: [],
  lessonPlusMinus: [],
  passwordResetRequests: [],
  updatedAt: new Date().toISOString(),
};

function readDb(): ServerState {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading server-db.json:', err);
  }
  return { ...DEFAULT_SERVER_STATE };
}

function writeDb(state: ServerState): void {
  try {
    state.updatedAt = new Date().toISOString();
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to server-db.json:', err);
  }
}

// In-memory reference initialized from disk
let memoryDb: ServerState = readDb();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '25mb' }));

  // API Health / Status
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      time: new Date().toISOString(),
      isInitialized: memoryDb.systemConfig.isInitialized,
      schoolName: memoryDb.systemConfig.schoolName || null,
    });
  });

  // GET /api/state: Get entire synchronized system state
  app.get('/api/state', (req, res) => {
    // Always refresh from disk in case of parallel writes
    memoryDb = readDb();
    res.json({
      status: 'ok',
      data: memoryDb,
    });
  });

  // POST /api/initialize: Initialize system ONCE for all devices
  app.post('/api/initialize', (req, res) => {
    memoryDb = readDb();

    // STRICT CHECK: Once initialized, cannot be initialized again from any device!
    if (memoryDb.systemConfig.isInitialized) {
      return res.status(409).json({
        error: 'System został już skonfigurowany. Administrator placówki może być utworzony tylko raz dla całej szkoły.',
        isInitialized: true,
        data: memoryDb,
      });
    }

    const {
      schoolName,
      schoolCity,
      academicYear,
      semester,
      adminName,
      adminEmail,
      adminPassword,
      includeDemoData,
    } = req.body || {};

    if (!adminName || !adminEmail) {
      return res.status(400).json({ error: 'Brak danych administratora (imię, e-mail).' });
    }

    const nowIso = new Date().toISOString();
    const newConfig = {
      isInitialized: true,
      schoolName: (schoolName || 'Szkoła Podstawowa').trim(),
      schoolCity: (schoolCity || 'Warszawa').trim(),
      academicYear: (academicYear || '2025/2026').trim(),
      semester: Number(semester) === 1 ? 1 : 2,
      adminName: adminName.trim(),
      adminEmail: adminEmail.trim(),
      initializedAt: nowIso,
    };

    const adminUser = {
      id: 'user_admin_' + Date.now(),
      name: newConfig.adminName,
      email: newConfig.adminEmail,
      password: adminPassword || 'admin123',
      role: 'admin',
      roleTitle: 'Główny Administrator Systemu',
      createdAt: nowIso.split('T')[0],
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    };

    const welcomeMsg = {
      id: 'msg_welcome_' + Date.now(),
      senderId: 'system',
      senderName: 'System EduSynergia',
      senderRole: 'Powiadomienie powitalne',
      recipientId: adminUser.id,
      recipientName: adminUser.name,
      subject: `Witaj w e-dzienniku szkoły ${newConfig.schoolName}!`,
      content: `Dzień dobry ${adminUser.name}!\n\nTwój elektroniczny dziennik lekcyjny dla szkoły "${newConfig.schoolName}" został pomyślnie uruchomiony w centralnej bazie danych.\n\nKonto Administratora zostało utworzone JEDNORAZOWO dla całej placówki. Każde kolejne urządzenie (telefon, laptop nauczyciela, komputer w sali) po otwarciu strony wyświetla wyłącznie ekran logowania.\n\nJako Administrator możesz zarządzać kontami, planem lekcji, ocenami oraz wnioskami o hasło.\n\nŻyczymy owocnej pracy i wspaniałej zabawy!`,
      date: nowIso.replace('T', ' ').slice(0, 16),
      isRead: false,
      isStarred: true,
    };

    const welcomeAnn = {
      id: 'ann_welcome_' + Date.now(),
      title: `Inauguracja Dziennika Elektronicznego · ${newConfig.schoolName}`,
      content: `Dziennik lekcyjny EduSynergia został pomyślnie skonfigurowany. Rejestracja publiczna jest wyłączona — wszystkimi kontami zarządza Administrator Placówki.`,
      authorName: adminUser.name,
      authorRole: 'Dyrektor Szkoły / Administrator',
      targetAudience: 'Wszyscy Użytkownicy',
      date: nowIso.split('T')[0],
      priority: 'important',
      pinned: true,
    };

    memoryDb = {
      ...DEFAULT_SERVER_STATE,
      systemConfig: newConfig as any,
      users: [adminUser],
      messages: [welcomeMsg],
      announcements: [welcomeAnn],
      updatedAt: nowIso,
    };

    writeDb(memoryDb);
    console.log(`[EduSynergia] System initialized successfully with Admin: ${adminUser.email}`);

    return res.json({
      status: 'ok',
      message: 'System pomyślnie skonfigurowany.',
      data: memoryDb,
      adminUser,
    });
  });

  // POST /api/sync: Synchronize state updates (users, grades, attendance, etc.) across devices
  app.post('/api/sync', (req, res) => {
    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Nieprawidłowe dane synchronizacji.' });
    }

    memoryDb = readDb();

    // If client is sending systemConfig updates, ensure initialized status is never reverted
    if (payload.systemConfig) {
      const wasInitialized = memoryDb.systemConfig.isInitialized;
      memoryDb.systemConfig = {
        ...memoryDb.systemConfig,
        ...payload.systemConfig,
        isInitialized: wasInitialized || Boolean(payload.systemConfig.isInitialized),
      };
    }

    if (Array.isArray(payload.users)) memoryDb.users = payload.users;
    if (Array.isArray(payload.students)) memoryDb.students = payload.students;
    if (Array.isArray(payload.grades)) memoryDb.grades = payload.grades;
    if (Array.isArray(payload.attendance)) memoryDb.attendance = payload.attendance;
    if (Array.isArray(payload.timetable)) memoryDb.timetable = payload.timetable;
    if (Array.isArray(payload.messages)) memoryDb.messages = payload.messages;
    if (Array.isArray(payload.announcements)) memoryDb.announcements = payload.announcements;
    if (Array.isArray(payload.homework)) memoryDb.homework = payload.homework;
    if (Array.isArray(payload.behaviorPoints)) memoryDb.behaviorPoints = payload.behaviorPoints;
    if (Array.isArray(payload.lessonPlusMinus)) memoryDb.lessonPlusMinus = payload.lessonPlusMinus;
    if (Array.isArray(payload.passwordResetRequests)) memoryDb.passwordResetRequests = payload.passwordResetRequests;

    writeDb(memoryDb);

    return res.json({
      status: 'ok',
      updatedAt: memoryDb.updatedAt,
      isInitialized: memoryDb.systemConfig.isInitialized,
    });
  });

  // POST /api/reset: Reset system back to uninitialized state (only when explicitly requested)
  app.post('/api/reset', (req, res) => {
    memoryDb = {
      ...DEFAULT_SERVER_STATE,
      systemConfig: { ...DEFAULT_SERVER_STATE.systemConfig, isInitialized: false },
      updatedAt: new Date().toISOString(),
    };
    writeDb(memoryDb);
    console.log('[EduSynergia] System reset to clean state.');
    return res.json({ status: 'ok', message: 'System zresetowany do stanu początkowego.' });
  });

  // Vite middleware in dev or static files in production
  const isProduction = process.env.NODE_ENV === 'production';
  const distPath = path.resolve(__dirname, 'dist');

  if (isProduction && fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduSynergia Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal server error:', err);
  process.exit(1);
});
