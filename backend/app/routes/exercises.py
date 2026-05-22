from fastapi import APIRouter

router = APIRouter()

EXERCISES = [
    {
        "id": "neck",
        "icon": "🔄",
        "name": "Neck Rolls",
        "namepl": "Rotacje szyi",
        "time": "2 min",
        "steps": [
            "Usiądź prosto, rozluźnij ramiona.",
            "Powoli przechyl głowę, przybliżając ucho do ramienia.",
            "Utrzymaj pozycję przez 5 sekund po każdej stronie.",
            "Przesuń brodę ku klatce piersiowej.",
            "Powtórz 3–4 razy łagodnie.",
        ],
    },
    {
        "id": "shoulders",
        "icon": "💆",
        "name": "Shoulder Release",
        "namepl": "Rozluźnienie ramion",
        "time": "2 min",
        "steps": [
            "Unieś oba ramiona ku uszom.",
            "Utrzymaj 3 sekundy, a następnie opuść.",
            "Wykonaj 5 okrążeń ramionami do tyłu, a potem do przodu.",
            "Spleć dłonie za plecami i zaciśnij.",
            "Powtórz 3 serie.",
        ],
    },
    {
        "id": "wrists",
        "icon": "🤲",
        "name": "Wrist Stretch",
        "namepl": "Rozciąganie nadgarstków",
        "time": "1 min",
        "steps": [
            "Wyciągnij jedno ramię do przodu, dłonią skierowaną ku górze.",
            "Drugą ręką delikatnie cofnij palce w dół.",
            "Utrzymaj 10–15 sekund przy każdym nadgarstku.",
            "Wykonaj powolne okrążenia pięścią w obu kierunkach.",
            "Powtórz dwa razy przy każdej dłoni.",
        ],
    },
    {
        "id": "back",
        "icon": "🦴",
        "name": "Back Extension",
        "namepl": "Wyprost pleców",
        "time": "2 min",
        "steps": [
            "Usiądź na przedniej krawędzi krzesła.",
            "Połóż dłonie na dolnej części pleców dla podparcia.",
            "Delikatnie wygnij się do tyłu, lekko unosząc brodę.",
            "Utrzymaj 3–5 sekund, wróć do pozycji centralnej.",
            "Powtórz 5 razy powoli.",
        ],
    },
    {
        "id": "eyes",
        "icon": "👁️",
        "name": "Eye Relaxation",
        "namepl": "Relaksacja oczu",
        "time": "1 min",
        "steps": [
            "Odwróć wzrok całkowicie od ekranu.",
            "Skup się na obiekcie oddalonym o co najmniej 6 metrów.",
            "Mrugnij powoli 10 razy, aby nawilżyć oczy.",
            "Delikatnie przyłóż ciepłe dłonie do zamkniętych oczu.",
            "Odpoczywaj przez 30 sekund w ciemności.",
        ],
    },
]


@router.get("/")
def get_exercises():
    return EXERCISES
