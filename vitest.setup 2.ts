import { afterAll } from 'vitest';
import { getApps, deleteApp } from 'firebase/app';

// This teardown ensures that any initialized Firebase apps (and their associated
// open handles like Auth refresh timers or Firestore sockets) are properly deleted
// after all tests run, allowing the Vitest process to exit normally.
afterAll(async () => {
  const apps = getApps();
  for (const app of apps) {
    try {
      await deleteApp(app);
    } catch (e) {
      console.error('Failed to delete Firebase app:', e);
    }
  }
});
