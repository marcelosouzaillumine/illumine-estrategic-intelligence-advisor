const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// Assumes you have the FIREBASE_CONFIG environment variable set or a service account key
// export GOOGLE_APPLICATION_CREDENTIALS="/path/to/serviceAccountKey.json"

if (!admin.apps.length) {
  try {
    admin.initializeApp();
  } catch (error) {
    console.error('Failed to initialize Firebase Admin. Ensure GOOGLE_APPLICATION_CREDENTIALS is set.');
    console.error(error);
    process.exit(1);
  }
}

const SUPER_ADMINS = [
  'marcelo.illuminecoaching@gmail.com',
  'marcelosouza.illumine@gmail.com',
  'avivacolonia@gmail.com'
];

async function setSuperAdmins() {
  console.log('Starting SUPER_ADMIN role assignment...');
  for (const email of SUPER_ADMINS) {
    try {
      const user = await admin.auth().getUserByEmail(email);
      console.log(`Found user ${email} with UID: ${user.uid}`);
      
      const currentClaims = user.customClaims || {};
      if (currentClaims.role === 'SUPER_ADMIN') {
        console.log(`User ${email} already has SUPER_ADMIN role. Skipping.`);
        continue;
      }
      
      await admin.auth().setCustomUserClaims(user.uid, {
        ...currentClaims,
        role: 'SUPER_ADMIN'
      });
      
      console.log(`Successfully assigned SUPER_ADMIN to ${email}`);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        console.log(`User ${email} not found in Firebase Auth.`);
      } else {
        console.error(`Error setting claim for ${email}:`, error);
      }
    }
  }
  console.log('Finished SUPER_ADMIN assignment.');
  process.exit(0);
}

setSuperAdmins();
