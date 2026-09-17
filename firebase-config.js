const firebaseConfig = {
  apiKey: "AIzaSyA_jBxGDHMADa4WNOGvAy29ZE2ROZVYtMU",
  authDomain: "roza-306be.firebaseapp.com",
  databaseURL: "https://roza-306be-default-rtdb.firebaseio.com",
  projectId: "roza-306be",
  storageBucket: "roza-306be.firebasestorage.app",
  messagingSenderId: "614737034501",
  appId: "1:614737034501:web:dba4a3f4e4445ea5ab8b6c",
  measurementId: "G-CJV2BTRWDH"
};

if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
}

// المنيو يُدار بالكامل من لوحة الإدارة ويُخزَّن في قاعدة البيانات.
// نبدأ فارغين — تُضاف الأقسام والأصناف من admin.html.
const initialData = {
  categories: [],
  items: []
};
