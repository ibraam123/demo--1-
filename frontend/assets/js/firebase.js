import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
apiKey: "AIzaSyAiF6aexb2ociekLIMecdXXzDO0W5WA4AI",
authDomain: "carrentalvelocify.firebaseapp.com",
projectId: "carrentalvelocify",
storageBucket: "carrentalvelocify.firebasestorage.app",
messagingSenderId: "571555095898",
appId: "1:571555095898:web:93279ef042f94c41fc7f63"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {auth};