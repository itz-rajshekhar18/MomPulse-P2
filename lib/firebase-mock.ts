// TEMPORARY MOCK - Replace with real Firebase once you get valid API key
// This allows the app to run without Firebase authentication

export const auth = null as any;
export const db = null as any;
export const googleProvider = null as any;
export const analytics = null;

const mockApp = {
  name: '[DEFAULT]',
  options: {},
  automaticDataCollectionEnabled: false
};

export default mockApp;

console.warn('⚠️ USING MOCK FIREBASE - Authentication will not work!');
console.warn('⚠️ Get a new API key from: https://console.firebase.google.com/project/mompulse-5ceb8/settings/general/');
