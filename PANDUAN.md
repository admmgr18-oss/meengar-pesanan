# Pesanan Tambahan — setup guide (GitHub app + phone notifications)

Total time: about **45–60 minutes, done once**, on a computer.
You need: a Google account (the one that owns the Google Sheet) and a free GitHub account.

How it fits together:

```
Phone / tablet (app from GitHub)  ⇄  Apps Script + Google Sheet (records)
                                         │
                                         └─► Firebase ─► notification to phone (rings even with screen off)
```

---

## A. Firebase (free) — about 15 min

1. Go to **console.firebase.google.com** → **Create a project** → name it e.g. `mee-ngar-pesanan` → turn **Google Analytics off** → **Create project**.
2. On the project home, click the **Web icon `</>`** → nickname `Pesanan` → **Register app** (do not tick Firebase Hosting).
   It shows a `firebaseConfig = { apiKey: ..., authDomain: ..., projectId: ..., storageBucket: ..., messagingSenderId: ..., appId: ... }` block. **Keep this page open** — you need these 6 values in step C4.
3. Click the **⚙ gear → Project settings → Cloud Messaging** tab → scroll to **Web Push certificates** → **Generate key pair**. Copy the long key (starts with `B…`). This is your **VAPID key**.
4. Still in Project settings → **Service accounts** tab → **Generate new private key** → **Generate key**. A `.json` file downloads.
   ⚠️ This file is a password. **Never upload it to GitHub.** It only goes into Apps Script (step B2).

## B. Apps Script (your existing Google Sheet) — about 10 min

1. Open your Google Sheet → **Extensions → Apps Script**. Open `Code.gs`, delete everything, paste the new **Code.gs**, click **Save**.
   (Keep the `Index` file as it is — the old link still works as a backup.)
2. Click **⚙ Project Settings** (left side) → scroll to **Script properties** → **Add script property**:
   - Property: `FIREBASE_SA`
   - Value: open the downloaded `.json` file with Notepad, **copy everything**, paste here → **Save script properties**.
3. Go back to **Editor** (`< >` icon). In the function list at the top choose **`setupPush`** → click **Run** → allow the permissions Google asks for.
   The log at the bottom must say: **"Siap! Firebase OK …"**. (This also turns on the reminder that rings again every 3 minutes until an order is handled.)
4. **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy.**
   Check: *Execute as* = **Me**, *Who has access* = **Anyone**.
   Copy the **Web app URL** (ends with `/exec`). You need it in step C4.

## C. GitHub (free) — about 15 min

1. Go to **github.com** → **Sign up** (free account). Choose a short username, e.g. `meengar` — it becomes part of your app link.
2. Top right **+ → New repository** → Repository name: `pesanan` → **Public** → **Create repository**.
3. Click **"uploading an existing file"** → unzip `pesanan-app.zip` on your computer → drag **all the files and the `icons` folder** into the page → **Commit changes**.
4. In the repository click **`config.js`** → **✏️ pencil (Edit)** → replace every `TAMPAL…`:
   - `apiUrl` → the Web app URL from **B4**
   - the 6 `firebase` values → from **A2**
   - `vapidKey` → from **A3**

   → **Commit changes**.
5. **Settings → Pages** → *Source*: **Deploy from a branch** → Branch: **main**, folder **/ (root)** → **Save**.
   Wait 1–2 minutes and refresh: it shows **"Your site is live at https://USERNAME.github.io/pesanan/"**. That is your app link.

## D. On each phone / tablet — 3 min each

**Android (Chrome):**
1. Open the app link in **Chrome** → tap the **"Pasang app ke skrin utama"** bar (or ⋮ menu → **Install app**).
2. Open **Pesanan** from the home screen icon → tap your name.
3. Tap **"Hidupkan notifikasi"** → **Allow**.
4. Tap the **🔔 bell** → **Hantar notifikasi ujian** → turn the screen off. It should ring within a few seconds.
5. Important on Xiaomi / Oppo / Vivo / Huawei / Samsung, so notifications are not blocked when the screen is off:
   - Settings → Apps → **Chrome** (and **Pesanan** if listed) → **Notifications: on**, sound on, "pop-up / heads-up" on.
   - Settings → Battery → Chrome → **Unrestricted / No restrictions** (turn off battery optimisation).
   - Notification sound follows the phone's **notification / ring volume** — keep it up.

**iPhone / iPad (iOS 16.4 or newer):** open the link in **Safari** → **Share → Add to Home Screen** → open from the icon → **Hidupkan notifikasi** → Allow.

Who gets which alert:
- **Pengeluaran** devices: new order (and again every 3 min until someone taps **Terima**).
- The **pelayan** who ordered: item ready (and again every 3 min until **Sudah Ambil**). If she has no device registered, all pelayan devices get it.
- Tapping a notification opens the app on the right list.

---

## Updating later
- **App screens** (`index.html`, etc.): on GitHub open the file → ✏️ Edit, or upload the new file → Commit. Phones get it next time the app opens.
- **Code.gs**: paste the new code → **Deploy → Manage deployments → Edit → New version → Deploy** (the `/exec` link stays the same).

## Problems?
| What you see | Fix |
|---|---|
| "config.js belum diisi" | Step C4 not done, or a value still says `TAMPAL`. |
| Sync dot red "Luar talian" | Check internet; check `apiUrl` is the `/exec` link and access is **Anyone** (B4). |
| Bell panel says "Belum disediakan" | Firebase values / VAPID key missing in `config.js`. |
| Test says "Notifikasi belum disediakan di Apps Script" | Step B2/B3 not done (`FIREBASE_SA`). |
| Test arrives only when screen is on | Phone battery saver is killing Chrome — see D5. |
| "Disekat" | Chrome → ⋮ → Settings → Site settings → Notifications → allow your app link. |

Notes:
- The values in `config.js` are **not secret** (Firebase web keys are designed to be public). The service-account `.json` **is** secret — keep it only in Apps Script.
- Anyone with your app link can use the app, so share the link only with staff.
- The **Peranti** tab in your Google Sheet lists every registered phone. Delete a row to stop alerts to that phone.
