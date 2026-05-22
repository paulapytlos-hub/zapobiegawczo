# Zapobiegawczo — Kompletny przewodnik projektu
> Dokument referencyjny do pracy w VS Code z Claude
> Język: Polski | Stack: React + FastAPI + SQLite

---

## Spis treści
1. [Co budujemy](#co-budujemy)
2. [Gotowy prototyp MVP](#gotowy-prototyp-mvp)
3. [Architektura projektu](#architektura-projektu)
4. [Struktura folderów](#struktura-folderów)
5. [Krok 1 — Instalacja narzędzi](#krok-1--instalacja-narzędzi)
6. [Krok 2 — Setup frontendu](#krok-2--setup-frontendu)
7. [Krok 3 — Setup backendu](#krok-3--setup-backendu)
8. [Krok 4 — Pliki frontendowe do napisania](#krok-4--pliki-frontendowe-do-napisania)
9. [Krok 5 — Pliki backendowe do napisania](#krok-5--pliki-backendowe-do-napisania)
10. [Krok 6 — Połączenie frontendu z backendem](#krok-6--połączenie-frontendu-z-backendem)
11. [Krok 7 — Uruchamianie projektu lokalnie](#krok-7--uruchamianie-projektu-lokalnie)
12. [Krok 8 — Deploy (wdrożenie online)](#krok-8--deploy-wdrożenie-online)
13. [API — lista endpointów](#api--lista-endpointów)
14. [Dane ćwiczeń](#dane-ćwiczeń)
15. [Fakty zdrowotne](#fakty-zdrowotne)
16. [Roadmapa przyszłych funkcji](#roadmapa-przyszłych-funkcji)
17. [Jak pracować z Claude w VS Code](#jak-pracować-z-claude-w-vs-code)

---

## Co budujemy

**Zapobiegawczo** — aplikacja webowa przypominająca pracownikom biurowym i programistom o przerwach zdrowotnych podczas długiej pracy przy komputerze.

### Główne funkcje MVP
- Licznik czasu pracy (Start / Pauza / Reset)
- Konfigurowalne interwały przypomnień (domyślnie: co 60 minut)
- Powiadomienia w przeglądarce (browser notifications)
- Modal z przypomnieniem i ćwiczeniami wewnątrz aplikacji
- 5 kategorii ćwiczeń: szyja, ramiona, nadgarstki, plecy, oczy
- Snooze przypomnienia o 5 minut
- Statystyki: liczba przerw, pominięte przypomnienia, czas siedzenia
- Ciekawostki zdrowotne po 2+ ignorowanych przypomnieniach
- Log sesji z timestampami
- **Dwa motywy wizualne**: Professional (minimalistyczny) i Cozy (ciepły, przytulny)

### Dla kogo
Programiści, pracownicy zdalni, pracownicy biurowi — osoby spędzające długie godziny przed ekranem.

### Vibe / estetyka
- Tryb Professional: Apple-style, clean tech, minimalistyczny, biało-zielony
- Tryb Cozy: ciepłe kolory, zaokrąglone kształty, font Nunito, koralowo-pomarańczowy

---

## Gotowy prototyp MVP

Działający prototyp został już zbudowany jako jeden plik HTML z wbudowanym CSS i JavaScript.  
Zawiera wszystkie funkcje MVP. Kod tego prototypu służy jako wzór do przepisania na React + FastAPI.

**Funkcje już działające w prototypie:**
- Timer z paskiem postępu
- Modal ćwiczeń z krokami
- Snooze
- Powiadomienia przeglądarki
- Dwa motywy (kliknij "Professional" w prawym górnym rogu)
- Log sesji
- Statystyki
- Banner z ciekawostkami zdrowotnymi

---

## Architektura projektu

```
Przeglądarka (React)  ←──axios──→  FastAPI (Python)  ←──SQLAlchemy──→  SQLite
     port 5173                          port 8000                    plik .db
```

- **Frontend (React)**: interfejs użytkownika, timer, modale, ustawienia
- **Backend (FastAPI)**: logika biznesowa, zapis danych, API endpoints
- **Baza danych (SQLite)**: zapis sesji, przerw, statystyk — na początku to zwykły plik `zapobiegawczo.db`

---

## Struktura folderów

```
zapobiegawczo/                          ← główny folder projektu
│
├── frontend/                           ← aplikacja React
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx              ← nagłówek + przełącznik motywu
│   │   │   ├── SessionTimer.jsx        ← główny timer + przycisk Start
│   │   │   ├── BreakModal.jsx          ← modal przypomnienia o przerwie
│   │   │   ├── ExerciseCard.jsx        ← karta pojedynczego ćwiczenia
│   │   │   ├── SettingsPanel.jsx       ← ustawienia interwału, powiadomień
│   │   │   ├── FactBanner.jsx          ← banner z ciekawostką zdrowotną
│   │   │   └── SessionLog.jsx          ← lista zdarzeń z timestampami
│   │   ├── store/
│   │   │   └── useAppStore.js          ← globalny stan (Zustand)
│   │   ├── api/
│   │   │   └── client.js               ← wszystkie wywołania do backendu
│   │   ├── data/
│   │   │   └── exercises.js            ← treść ćwiczeń i ciekawostki
│   │   ├── App.jsx                     ← główny komponent, składa wszystko razem
│   │   ├── main.jsx                    ← punkt wejścia React
│   │   └── index.css                   ← Tailwind + zmienne CSS motywów
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── backend/                            ← API Python
│   ├── venv/                           ← wirtualne środowisko (nie dotykać)
│   ├── app/
│   │   ├── main.py                     ← FastAPI app, CORS, startup
│   │   ├── database.py                 ← połączenie z SQLite
│   │   ├── models.py                   ← definicje tabel bazy danych
│   │   ├── schemas.py                  ← kształty danych (Pydantic)
│   │   └── routes/
│   │       ├── sessions.py             ← endpointy /sessions
│   │       └── exercises.py            ← endpointy /exercises
│   ├── zapobiegawczo.db                ← plik bazy danych SQLite (auto-tworzony)
│   └── requirements.txt               ← lista zależności Python
│
└── README.md
```

---

## Krok 1 — Instalacja narzędzi

### Na Windows — otwórz Command Prompt i sprawdź:

```bash
node --version     # powinno pokazać v18+ lub v20+
npm --version      # powinno pokazać 9+ lub 10+
python --version   # powinno pokazać 3.10+
pip --version      # powinno pokazać 23+
```

### Jeśli czegoś brakuje:
- **Node.js**: pobierz LTS z https://nodejs.org (zaznacz "Add to PATH" podczas instalacji)
- **Python**: pobierz z https://python.org (zaznacz "Add Python to PATH" podczas instalacji)

### Rozszerzenia VS Code do zainstalowania:
1. **ES7+ React/Redux Snippets** (dsznajder)
2. **Tailwind CSS IntelliSense** (Bradlc)
3. **Python** (Microsoft)
4. **Prettier - Code formatter**
5. **Claude** (Anthropic) — już masz!

---

## Krok 2 — Setup frontendu

Otwórz terminal w VS Code (`Ctrl + backtick`) i wykonaj:

```bash
# Utwórz główny folder projektu
mkdir zapobiegawczo
cd zapobiegawczo

# Utwórz projekt React z Vite
npm create vite@latest frontend -- --template react
cd frontend

# Zainstaluj zależności bazowe
npm install

# Zainstaluj Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Zainstaluj biblioteki projektu
npm install framer-motion zustand axios

# Wróć do głównego folderu
cd ..
```

### Konfiguracja Tailwind

Zamień zawartość `frontend/tailwind.config.js` na:
```js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

Zamień zawartość `frontend/src/index.css` na:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Test:
```bash
cd frontend
npm run dev
```
Otwórz http://localhost:5173 — powinna się pokazać domyślna strona React.

---

## Krok 3 — Setup backendu

```bash
# Będąc w głównym folderze zapobiegawczo/
mkdir backend
cd backend

# Utwórz wirtualne środowisko Python
python -m venv venv

# Aktywuj środowisko (WAŻNE: rób to za każdym razem!)
venv\Scripts\activate

# Zainstaluj zależności
pip install fastapi uvicorn sqlalchemy pydantic python-dotenv

# Zapisz zależności do pliku
pip freeze > requirements.txt

cd ..
```

### Jak rozpoznać że venv jest aktywny:
Na początku linii terminala zobaczysz `(venv)`:
```
(venv) C:\Users\TwojeImie\zapobiegawczo\backend>
```

### Test backendu (po napisaniu main.py):
```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload
```
Otwórz http://localhost:8000/docs — automatyczna dokumentacja API.

---

## Krok 4 — Pliki frontendowe do napisania

Poproś Claude w VS Code o wygenerowanie każdego pliku osobno.
Sugerowana kolejność (od najłatwiejszego):

### 1. `src/data/exercises.js`
Plik z danymi — bez logiki, tylko treść.
**Prompt dla Claude:** "Napisz plik exercises.js z tablicą 5 ćwiczeń: szyja, ramiona, nadgarstki, plecy, oczy. Każde ćwiczenie ma: id, icon (emoji), name, time (np. '2 min'), steps (tablica kroków po polsku lub angielsku)."

### 2. `src/store/useAppStore.js`
Globalny stan aplikacji używając Zustand.
**Prompt dla Claude:** "Napisz useAppStore.js używając Zustand. Stan powinien zawierać: sessionActive, elapsed (sekundy), intervalMinutes (default 60), breaksDone, remindersIgnored, logItems (tablica), notifEnabled, popupEnabled, cuteMode. Akcje: startSession, pauseSession, resumeSession, resetSession, completeBreak, snoozeBreak, addLog, toggleMode, updateInterval."

### 3. `src/components/Header.jsx`
**Prompt dla Claude:** "Napisz komponent Header.jsx dla aplikacji Zapobiegawczo. Logo po lewej, przełącznik motywu (Professional/Cozy) po prawej. Używa useAppStore do toggleMode. Tailwind CSS."

### 4. `src/components/SessionTimer.jsx`
**Prompt dla Claude:** "Napisz komponent SessionTimer.jsx. Pokazuje: status (aktywna/pauza/nieaktywna), timer w formacie MM:SS, pasek postępu do następnej przerwy, informację o czasie do przerwy. Przyciski: Start Session / Pause / Resume + Reset. Używa useAppStore. Tailwind CSS."

### 5. `src/components/BreakModal.jsx`
**Prompt dla Claude:** "Napisz komponent BreakModal.jsx — modal przypomnienia o przerwie. Pokazuje losowe ćwiczenie z krokami. Przyciski: 'Done — I stretched' i 'Snooze 5 min'. Używa useAppStore."

### 6. `src/components/ExerciseCard.jsx`
Karta ćwiczenia klikalnego.

### 7. `src/components/SettingsPanel.jsx`
Panel ustawień: wybór interwału, toggle powiadomień, toggle popupów.

### 8. `src/components/FactBanner.jsx`
Banner z ciekawostką zdrowotną (pojawia się po 2+ ignorowanych przypomnieniach).

### 9. `src/components/SessionLog.jsx`
Lista zdarzeń sesji z timestampami.

### 10. `src/api/client.js`
Wszystkie wywołania axios do backendu.

### 11. `src/App.jsx`
Główny komponent składający wszystko razem + logika timera (useEffect z setInterval).

---

## Krok 5 — Pliki backendowe do napisania

### 1. `backend/app/database.py`
```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./zapobiegawczo.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### 2. `backend/app/models.py`
```python
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Session(Base):
    __tablename__ = "sessions"
    id = Column(Integer, primary_key=True, index=True)
    started_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime, nullable=True)
    duration_seconds = Column(Integer, nullable=True)
    interval_minutes = Column(Integer, default=60)
    breaks = relationship("Break", back_populates="session")

class Break(Base):
    __tablename__ = "breaks"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"))
    exercise_id = Column(String)
    completed_at = Column(DateTime, default=datetime.utcnow)
    snoozed = Column(Boolean, default=False)
    session = relationship("Session", back_populates="breaks")
```

### 3. `backend/app/schemas.py`
```python
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SessionCreate(BaseModel):
    interval_minutes: int = 60

class SessionResponse(BaseModel):
    id: int
    started_at: datetime
    interval_minutes: int
    class Config:
        from_attributes = True

class BreakCreate(BaseModel):
    exercise_id: str
    snoozed: bool = False

class TodayStats(BaseModel):
    breaks_done: int
    reminders_ignored: int
    total_sitting_minutes: int
    sessions_today: int
```

### 4. `backend/app/routes/sessions.py`
**Prompt dla Claude:** "Napisz plik routes/sessions.py dla FastAPI. Endpointy: POST /sessions/start, PATCH /sessions/{id}/end (zapisz ended_at i duration_seconds), POST /sessions/{id}/breaks (zapisz przerwę), GET /sessions/today (zwróć TodayStats: breaks_done, reminders_ignored, total_sitting_minutes, sessions_today). Używa SQLAlchemy, schemas z schemas.py."

### 5. `backend/app/main.py`
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routes import sessions, exercises

# Utwórz tabele w bazie danych
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Zapobiegawczo API", version="1.0.0")

# CORS — pozwól frontendowi (localhost:5173) rozmawiać z backendem
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sessions.router, prefix="/sessions", tags=["sessions"])
app.include_router(exercises.router, prefix="/exercises", tags=["exercises"])

@app.get("/")
def root():
    return {"message": "Zapobiegawczo API działa!"}
```

---

## Krok 6 — Połączenie frontendu z backendem

### `frontend/src/api/client.js`
```js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000'
})

// Sesje
export const startSession = (intervalMinutes) =>
  api.post('/sessions/start', { interval_minutes: intervalMinutes })

export const endSession = (id, durationSeconds) =>
  api.patch(`/sessions/${id}/end`, { duration_seconds: durationSeconds })

export const logBreak = (sessionId, exerciseId, snoozed = false) =>
  api.post(`/sessions/${sessionId}/breaks`, {
    exercise_id: exerciseId,
    snoozed
  })

export const getTodayStats = () =>
  api.get('/sessions/today')

// Ćwiczenia
export const getExercises = () =>
  api.get('/exercises')
```

### Ważne: CORS
Frontend (port 5173) i backend (port 8000) to różne "serwery" — przeglądarka domyślnie blokuje taką komunikację. Dlatego w `main.py` jest `CORSMiddleware` — bez tego axios będzie dostawać błędy.

---

## Krok 7 — Uruchamianie projektu lokalnie

Potrzebujesz **dwóch otwartych terminali** w VS Code jednocześnie.

### Terminal 1 — Frontend
```bash
cd zapobiegawczo/frontend
npm run dev
```
→ Aplikacja React: http://localhost:5173

### Terminal 2 — Backend
```bash
cd zapobiegawczo/backend
venv\Scripts\activate
uvicorn app.main:app --reload
```
→ API Python: http://localhost:8000
→ Dokumentacja API: http://localhost:8000/docs

### Jak otworzyć dwa terminale w VS Code:
- `Ctrl + Shift + 5` — podziel terminal
- lub kliknij ikonę `+` w panelu terminala, żeby dodać nowy

---

## Krok 8 — Deploy (wdrożenie online)

Gdy aplikacja działa lokalnie, możesz ją wdrożyć za darmo:

| Co | Gdzie | Koszt | Jak |
|----|-------|-------|-----|
| Frontend | **Vercel** (vercel.com) | Darmowe | Podłącz repo GitHub, auto-deploy |
| Backend | **Railway** (railway.app) | Darmowe (5$/mies. po limicie) | Deploy z GitHub, dodaj zmienne env |
| Baza danych | SQLite na Railway | Darmowe | Plik .db razem z backendem |

### Kolejność deploymentu:
1. Utwórz konto GitHub i wgraj kod: `git init`, `git add .`, `git commit -m "first commit"`, `git push`
2. Wdróż backend na Railway → skopiuj URL (np. `https://zapobiegawczo.railway.app`)
3. Zmień `baseURL` w `client.js` na URL Railway
4. Wdróż frontend na Vercel → gotowe!

---

## API — lista endpointów

| Metoda | URL | Co robi | Body |
|--------|-----|---------|------|
| GET | `/` | Health check | — |
| POST | `/sessions/start` | Rozpocznij sesję | `{interval_minutes: 60}` |
| PATCH | `/sessions/{id}/end` | Zakończ sesję | `{duration_seconds: 3600}` |
| POST | `/sessions/{id}/breaks` | Zapisz przerwę | `{exercise_id: "neck", snoozed: false}` |
| GET | `/sessions/today` | Statystyki dzisiejsze | — |
| GET | `/exercises` | Lista ćwiczeń | — |

Wszystkie endpointy możesz testować interaktywnie na http://localhost:8000/docs

---

## Dane ćwiczeń

```js
// src/data/exercises.js
export const exercises = [
  {
    id: 'neck',
    icon: '🔄',
    name: 'Neck Rolls',
    namepl: 'Rotacje szyi',
    time: '2 min',
    steps: [
      'Usiądź prosto, rozluźnij ramiona.',
      'Powoli przechyl głowę, przybliżając ucho do ramienia.',
      'Utrzymaj pozycję przez 5 sekund po każdej stronie.',
      'Przesuń brodę ku klatce piersiowej.',
      'Powtórz 3–4 razy łagodnie.'
    ]
  },
  {
    id: 'shoulders',
    icon: '💆',
    name: 'Shoulder Release',
    namepl: 'Rozluźnienie ramion',
    time: '2 min',
    steps: [
      'Unieś oba ramiona ku uszom.',
      'Utrzymaj 3 sekundy, a następnie opuść.',
      'Wykonaj 5 okrążeń ramionami do tyłu, a potem do przodu.',
      'Spleć dłonie za plecami i zaciśnij.',
      'Powtórz 3 serie.'
    ]
  },
  {
    id: 'wrists',
    icon: '🤲',
    name: 'Wrist Stretch',
    namepl: 'Rozciąganie nadgarstków',
    time: '1 min',
    steps: [
      'Wyciągnij jedno ramię do przodu, dłonią skierowaną ku górze.',
      'Drugą ręką delikatnie cofnij palce w dół.',
      'Utrzymaj 10–15 sekund przy każdym nadgarstku.',
      'Wykonaj powolne okrążenia pięścią w obu kierunkach.',
      'Powtórz dwa razy przy każdej dłoni.'
    ]
  },
  {
    id: 'back',
    icon: '🦴',
    name: 'Back Extension',
    namepl: 'Wyprost pleców',
    time: '2 min',
    steps: [
      'Usiądź na przedniej krawędzi krzesła.',
      'Połóż dłonie na dolnej części pleców dla podparcia.',
      'Delikatnie wygnij się do tyłu, lekko unosząc brodę.',
      'Utrzymaj 3–5 sekund, wróć do pozycji centralnej.',
      'Powtórz 5 razy powoli.'
    ]
  },
  {
    id: 'eyes',
    icon: '👁️',
    name: 'Eye Relaxation',
    namepl: 'Relaksacja oczu',
    time: '1 min',
    steps: [
      'Odwróć wzrok całkowicie od ekranu.',
      'Skup się na obiekcie oddalonym o co najmniej 6 metrów.',
      'Mrugnij powoli 10 razy, aby nawilżyć oczy.',
      'Delikatnie przyłóż ciepłe dłonie do zamkniętych oczu.',
      'Odpoczywaj przez 30 sekund w ciemności.'
    ]
  }
]
```

---

## Fakty zdrowotne

```js
// Dodaj do src/data/exercises.js
export const healthFacts = [
  "Długotrwałe siedzenie znacząco zwiększa napięcie szyi i pleców.",
  "Większość pracowników biurowych doświadcza problemów z postawą w ciągu 2 lat pracy przy biurku.",
  "Krążki kręgosłupa są o 40% bardziej obciążone w pozycji siedzącej niż stojącej.",
  "Krótkie 2-minutowe przerwy ruchowe co godzinę zmniejszają zmęczenie nawet o 30%.",
  "Zmęczenie oczu to dolegliwość nr 1 wśród osób pracujących 8+ godzin przy ekranie.",
  "Regularne rozciąganie nadgarstków może znacznie zmniejszyć ryzyko urazów przeciążeniowych.",
  "Stanie przez zaledwie 5 minut co godzinę istotnie redukuje ból dolnej części pleców.",
  "Napięcie ramion od pracy przy ekranie może powodować bóle głowy u 60% przypadków."
]
```

---

## Roadmapa przyszłych funkcji

### Wersja 1.1
- [ ] Konta użytkowników (rejestracja / logowanie)
- [ ] Streaki (serie dni z ukończonymi przerwami)
- [ ] Dashboard analityczny (wykresy, historia)

### Wersja 1.2
- [ ] Tryb Pomodoro (25 min pracy / 5 min przerwy)
- [ ] Wynik postawy (Posture Score)
- [ ] Rekomendacje personalizowane

### Wersja 2.0
- [ ] Rekomendacje AI (FastAPI + Claude API)
- [ ] Integracja z zegarkiem (smartwatch)
- [ ] Detekcja postawy przez kamerę (webcam)
- [ ] Aplikacja mobilna (React Native)

---

## Jak pracować z Claude w VS Code

### Najskuteczniejsze prompty do generowania kodu:

#### Generowanie pojedynczego komponentu:
```
Napisz komponent React [NazwaKomponentu].jsx dla aplikacji Zapobiegawczo.
Kontekst: [opisz co robi ten komponent]
Stan: używa useAppStore z Zustand (dostępne akcje: ...)
Stylowanie: Tailwind CSS
Wymagania: [lista wymagań]
```

#### Generowanie endpointu FastAPI:
```
Napisz endpoint FastAPI w pliku routes/sessions.py.
Metoda: POST
URL: /sessions/{id}/breaks
Co robi: zapisuje przerwę do bazy SQLite używając SQLAlchemy
Body: {exercise_id: string, snoozed: boolean}
Zwraca: obiekt Break z id i completed_at
Używa: schemas.py i models.py (które już mamy)
```

#### Debugowanie błędów:
```
Dostaję błąd: [wklej błąd]
Plik: [nazwa pliku]
Kod: [wklej kod]
Co może być przyczyną i jak to naprawić?
```

#### Rozszerzanie funkcji:
```
Mam działający komponent SessionTimer.jsx [wklej kod].
Chcę dodać: [nowa funkcja].
Jak to zrobić bez psucia istniejącego kodu?
```

### Wskazówki do pracy z Claude w VS Code:
- **Daj kontekst** — wklej istniejący kod, który ma być powiązany
- **Jedno zadanie na raz** — nie proś o 5 plików jednocześnie
- **Opisz co już masz** — "mam już useAppStore z tymi akcjami: ..."
- **Pytaj o wyjaśnienia** — "wyjaśnij mi tę linię kodu"
- **Iteruj** — "zmień to tak, żeby..."

---

## Zmienne środowiskowe (do późniejszego użycia)

Utwórz plik `backend/.env`:
```
DATABASE_URL=sqlite:///./zapobiegawczo.db
SECRET_KEY=twoj-tajny-klucz-zmien-to
ENVIRONMENT=development
```

Utwórz plik `frontend/.env`:
```
VITE_API_URL=http://localhost:8000
```

---

## Częste błędy i rozwiązania

| Błąd | Przyczyna | Rozwiązanie |
|------|-----------|-------------|
| `npm: command not found` | Node.js nie zainstalowany | Zainstaluj z nodejs.org |
| `venv\Scripts\activate` nie działa | PowerShell blokuje skrypty | Uruchom: `Set-ExecutionPolicy RemoteSigned` |
| CORS error w konsoli | Backend nie ma CORS middleware | Sprawdź CORSMiddleware w main.py |
| `Module not found` w React | Brak instalacji biblioteki | `npm install nazwa-biblioteki` |
| `ModuleNotFoundError` w Python | Brak aktywnego venv lub biblioteki | Aktywuj venv, potem `pip install nazwa` |
| Port 5173 zajęty | Inny proces używa portu | `npm run dev -- --port 5174` |
| Port 8000 zajęty | Inny uvicorn już działa | Zamknij poprzedni terminal lub użyj `--port 8001` |

---

*Dokument wygenerowany w ramach sesji projektowej z Claude (Anthropic)*
*Projekt: Zapobiegawczo — aplikacja przypomnień zdrowotnych*
*Stack: React + Vite + Tailwind + Framer Motion + FastAPI + SQLite*
