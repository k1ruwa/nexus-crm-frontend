export interface Contact {
  id: string;
  name: string;
  company?: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  metAt?: string;
  notes?: string;
  avatarUrl?: string;
  createdAt: number;
}

const DB_NAME = "nexus_crm";
const DB_VERSION = 1;
const STORE_NAME = "contacts";

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
}

export async function getContacts(): Promise<Contact[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => {
      // Sort by newest first
      const contacts = request.result as Contact[];
      resolve(contacts.sort((a, b) => b.createdAt - a.createdAt));
    };
    request.onerror = () => reject(request.error);
  });
}

export async function getContact(id: string): Promise<Contact | undefined> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveContact(contact: Contact): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(contact);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function deleteContact(id: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function seedInitialData(): Promise<void> {
  const contacts = await getContacts();
  if (contacts.length === 0) {
    const initialData: Contact[] = [
      {
        id: "1",
        name: "Sarah Jenkins",
        company: "TechCorp",
        jobTitle: "Product Manager",
        email: "sarah.j@techcorp.com",
        phone: "+1 555-0192",
        metAt: "Tech Summit 2026",
        notes: "Interested in early access to Nexus API.",
        avatarUrl: "https://images.unsplash.com/photo-1576558656222-ba66febe3dec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3Mzk4MjExMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        createdAt: Date.now() - 86400000 * 2,
      },
      {
        id: "2",
        name: "David Chen",
        company: "Venture Partners",
        jobTitle: "Partner",
        email: "dchen@vp.vc",
        phone: "+1 555-8834",
        metAt: "Coffee shop in SOMA",
        notes: "Looking for promising AI startups. Follow up next week.",
        avatarUrl: "https://images.unsplash.com/photo-1762522927402-f390672558d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBwb3J0cmFpdCUyMGhlYWRzaG90fGVufDF8fHx8MTc3NDAxODg4MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        createdAt: Date.now() - 86400000 * 5,
      },
      {
        id: "3",
        name: "Emily Rodriguez",
        company: "Designify",
        jobTitle: "Lead Designer",
        email: "emily@designify.studio",
        phone: "+1 555-4301",
        metAt: "Awwwards Conference",
        notes: "Great chat about mobile-first CRM UX.",
        avatarUrl: "https://images.unsplash.com/photo-1607749091702-1bab1be215a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRseSUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzczOTQ5MDMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        createdAt: Date.now() - 86400000 * 10,
      }
    ];
    for (const c of initialData) {
      await saveContact(c);
    }
  }
}
