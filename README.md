# COPLACE - Marketplace Kopi Lokal Indonesia

Marketplace kopi lokal Indonesia dengan AI Barista untuk analisis kesehatan dan storytelling kopi. Dilengkapi fitur realtime threads untuk komunitas pecinta kopi.

## Tech Stack

- **Frontend**: React (Vite) + JavaScript
- **Styling**: TailwindCSS 3.4
- **Icons**: Lucide React
- **Animation**: Framer Motion
- **Backend**: Firebase v9 (Auth, Firestore, Storage)
- **AI**: Google Gemini API

## Fitur Utama

### 1. Marketplace Kopi
- Bento card grid dengan filter origin
- Search produk realtime
- Detail produk dengan gambar
- Keranjang belanja realtime

### 2. AI Barista
- Analisis fakta medis kopi
- Storytelling origin kopi
- Rekomendasi pairing makanan
- Info keamanan untuk kondisi kesehatan (GERD, dll)

### 3. Realtime Threads
- Post status dengan hashtag dan mention
- Like dan reply realtime
- Trending hashtags
- Online users indicator

### 4. Role-Based Auth
- **Pembeli**: Browse, beli, akses AI barista
- **Penjual**: Dashboard kelola produk, upload foto

## Instalasi

### 1. Clone Repository
```bash
git clone <repository-url>
cd coplace-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Buat file `.env` di root folder:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Google Gemini AI
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 4. Setup Firebase

1. Buat project di [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication dengan Email/Password
3. Buat Firestore Database
4. Enable Storage
5. Copy config ke file `.env`

#### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    match /products/{productId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.createdBy;
    }
    match /threads/{threadId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
    match /carts/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

#### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 5. Setup Gemini API

1. Buka [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Buat API Key baru
3. Copy ke `VITE_GEMINI_API_KEY` di file `.env`

### 6. Jalankan Development Server
```bash
npm run dev
```

Buka http://localhost:5173

## Deploy ke Vercel

### 1. Push ke GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Import di Vercel
1. Buka [Vercel](https://vercel.com)
2. Import repository dari GitHub
3. Tambahkan Environment Variables (sama seperti `.env`)
4. Deploy!

## Struktur Folder

```
src/
├── lib/
│   ├── firebase.js      # Firebase config
│   └── gemini.js        # Gemini AI functions
├── context/
│   ├── AuthContext.jsx  # Auth state management
│   └── CartContext.jsx  # Cart state management
├── components/
│   ├── ui/              # Reusable UI components
│   ├── layout/          # Navbar, Footer
│   ├── product/         # Product components
│   ├── threads/         # Thread components
│   └── ai/              # AI components
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Marketplace.jsx
│   ├── ProductDetail.jsx
│   ├── Threads.jsx
│   ├── Cart.jsx
│   └── SellerDashboard.jsx
├── utils/
│   └── dateUtils.js
├── App.jsx
├── main.jsx
└── index.css
```

## Design System

- **Background**: #0a0a0a
- **Primary (Orange)**: #f97316
- **Secondary (Lime)**: #84cc16
- **Glass Card**: bg-white/5 border-white/10 backdrop-blur-xl
- **Font**: Plus Jakarta Sans

## Demo Flow

### Buyer Flow
1. Register sebagai Pembeli
2. Browse Marketplace
3. Klik produk untuk detail
4. Gunakan AI Barista untuk analisis
5. Tambah ke keranjang
6. Checkout

### Seller Flow
1. Register sebagai Penjual
2. Akses Dashboard
3. Tambah produk baru dengan foto
4. Edit/hapus produk

## License

MIT License
