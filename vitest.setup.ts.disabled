import { vi } from 'vitest';

// Mock Firebase globals to prevent network calls and open handles during tests
vi.mock('firebase/app', () => {
  return {
    initializeApp: vi.fn(() => ({})),
    getApp: vi.fn(() => ({})),
  };
});

vi.mock('firebase/firestore', () => {
  return {
    getFirestore: vi.fn(() => ({})),
    doc: vi.fn(),
    getDocFromServer: vi.fn(),
    collection: vi.fn(),
    getDocs: vi.fn(),
    setDoc: vi.fn(),
    deleteDoc: vi.fn(),
    updateDoc: vi.fn(),
  };
});

vi.mock('firebase/auth', () => {
  return {
    getAuth: vi.fn(() => ({ currentUser: null })),
    GoogleAuthProvider: class {},
    signInWithPopup: vi.fn(),
    signOut: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    sendPasswordResetEmail: vi.fn(),
  };
});

vi.mock('firebase/storage', () => {
  return {
    getStorage: vi.fn(() => ({})),
  };
});
