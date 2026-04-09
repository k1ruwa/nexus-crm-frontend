// IndexedDB utilities for local-first storage

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  notes?: string;
  tags?: string[];
  profileImage?: string;
  source: 'manual' | 'camera' | 'voice';
  voiceNotes?: VoiceNote[];
  aiEnriched?: boolean;
  linkedIn?: string;
  twitter?: string;
  website?: string;
  favorite?: boolean;
  createdAt: number;
  updatedAt: number;
  lastContactedAt?: number;
}

export interface VoiceNote {
  id: string;
  contactId: string;
  audioBlob: string; // base64 encoded
  transcript?: string;
  duration: number;
  createdAt: number;
}

export interface Reminder {
  id: string;
  contactId: string;
  title: string;
  description?: string;
  dueDate: number;
  completed: boolean;
  createdAt: number;
}

const DB_NAME = 'nexus-crm';
const DB_VERSION = 1;

let db: IDBDatabase | null = null;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Contacts store
      if (!database.objectStoreNames.contains('contacts')) {
        const contactStore = database.createObjectStore('contacts', { keyPath: 'id' });
        contactStore.createIndex('name', 'name', { unique: false });
        contactStore.createIndex('company', 'company', { unique: false });
        contactStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // Voice notes store
      if (!database.objectStoreNames.contains('voiceNotes')) {
        const voiceStore = database.createObjectStore('voiceNotes', { keyPath: 'id' });
        voiceStore.createIndex('contactId', 'contactId', { unique: false });
        voiceStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // Reminders store
      if (!database.objectStoreNames.contains('reminders')) {
        const reminderStore = database.createObjectStore('reminders', { keyPath: 'id' });
        reminderStore.createIndex('contactId', 'contactId', { unique: false });
        reminderStore.createIndex('dueDate', 'dueDate', { unique: false });
        reminderStore.createIndex('completed', 'completed', { unique: false });
      }
    };
  });
};

// Contact CRUD operations
export const addContact = async (contact: Contact): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['contacts'], 'readwrite');
    const store = transaction.objectStore('contacts');
    const request = store.add(contact);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const updateContact = async (contact: Contact): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['contacts'], 'readwrite');
    const store = transaction.objectStore('contacts');
    const request = store.put(contact);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getContact = async (id: string): Promise<Contact | undefined> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['contacts'], 'readonly');
    const store = transaction.objectStore('contacts');
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getAllContacts = async (): Promise<Contact[]> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['contacts'], 'readonly');
    const store = transaction.objectStore('contacts');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};

export const deleteContact = async (id: string): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['contacts'], 'readwrite');
    const store = transaction.objectStore('contacts');
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Voice Note operations
export const addVoiceNote = async (note: VoiceNote): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['voiceNotes'], 'readwrite');
    const store = transaction.objectStore('voiceNotes');
    const request = store.add(note);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getVoiceNotesByContact = async (contactId: string): Promise<VoiceNote[]> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['voiceNotes'], 'readonly');
    const store = transaction.objectStore('voiceNotes');
    const index = store.index('contactId');
    const request = index.getAll(contactId);

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};

// Reminder operations
export const addReminder = async (reminder: Reminder): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['reminders'], 'readwrite');
    const store = transaction.objectStore('reminders');
    const request = store.add(reminder);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const updateReminder = async (reminder: Reminder): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['reminders'], 'readwrite');
    const store = transaction.objectStore('reminders');
    const request = store.put(reminder);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getAllReminders = async (): Promise<Reminder[]> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['reminders'], 'readonly');
    const store = transaction.objectStore('reminders');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};

export const getRemindersByContact = async (contactId: string): Promise<Reminder[]> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['reminders'], 'readonly');
    const store = transaction.objectStore('reminders');
    const index = store.index('contactId');
    const request = index.getAll(contactId);

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};

export const deleteReminder = async (id: string): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['reminders'], 'readwrite');
    const store = transaction.objectStore('reminders');
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};