/* ============================================================
   TETAPAN APP — ini SATU-SATUNYA fail yang anda perlu ubah.
   Ikut panduan PANDUAN.md (langkah C4).
   ============================================================ */
self.APP_CONFIG = {
  // 1) URL Web App Apps Script anda (berakhir dengan /exec)
  apiUrl: "https://script.google.com/macros/s/AKfycbwBFpnDa1aYeqrFwBMF98IPV7YuuqP-SDKL0EVNJx3AbLfkKnc5A3v5cJ05enEEcmA1dw/exec",

  // 2) Firebase → Project settings → General → Your apps → SDK setup and configuration → Config
  firebase: {
    apiKey: "AIzaSyA6fujJCoGU1WS82FMLG_y9AMwR99fzShY",
    authDomain: "mee-ngar-pesana.firebaseapp.com",
    projectId: "mee-ngar-pesana",
    storageBucket: "mee-ngar-pesana.firebasestorage.app",
    messagingSenderId: "196703892051",
    appId: "1:196703892051:web:6c0cec33787dad6dddcca6"
  },

  // 3) Firebase → Project settings → Cloud Messaging → Web Push certificates → Key pair
  vapidKey: "BAzi7dqYfFne5n9l7sqd5WQTi7wlgj8VuisaJr1VTe6LYeLrH7X3fVBBIpcoK6bTN2OZSccw1Ib35NIIaqlwq7Y"
};
