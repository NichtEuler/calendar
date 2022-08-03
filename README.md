[![Node.js CI](https://github.com/NichtEuler/calendar/actions/workflows/node.js.yml/badge.svg?branch=autodeploy)](https://github.com/NichtEuler/calendar/actions/workflows/node.js.yml)

# Prerequisites
Eine funktionsfähige [Node.js](https://nodejs.org/en/) Installation.
```
git clone https://github.com/NichtEuler/calendar.git
npm install
```

## Starten des Front- und Backends

```
//Frontend
ng serve

//Backend
nodemon backend/server.js
```

oder die in VSCode zur Verfügung stehenden NPM-Scripts verwenden.


### TODO-Liste

- [x] Einarbeitung in MEAN-Stack (bis 23.03.)
    - [x] Einarbeitung MongoDB (Backend)
    - [x] Einarbeitung Express (Middleware)
    - [x] Einarbeitung Angular + Material (Frontend)
    - [x] Einarbeitung NodeJs (Middleware)
- [x] Allgemein
    - [x] Datenstruktur Backend als UML
    - [x] Klassen Frontend als UML
    - [x] Flussdiagramm UML
- [x] Frontend (bis 03.06.)
    - [x] Headertoolbar
        - [x] Suchleiste für Räume mit Autocomplete
        - [x] Abfrage Räume aus Datenbank
    - [x] Kalender
        - [x] Events hinzufügen (Modales Fenster)
        - [x] Events ändern (Modales Fenster)
        - [x] Modales Fenster zur Eventbearbeitung
            - [x] Datepicker
            - [x] Timepicker
            - [x] State-Management
            - [x] Validators
        - [x] Kalender für Raum ändern
    - [x] Login
        - [x] Loginscreen
        - [x] Statemanagement
    - [x] Routing
- [x] Middleware (bis 06.05.)
    - [x] CORS Header setzen
    - [x] Kommunikation mit Backend
    - [x] Modelle erstellen
    - [x] Controller erstellen
    - [x] Routes erstellen
- [x] Backend (bis 15.04.)
    - [x] MongoDB initialisieren
    - [x] Atlas clusters anlegen
    - [x] Lokale Datenbank anlegen (optional)
    - [x] Testdaten einfügen