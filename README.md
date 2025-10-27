# Transcendence

A full-stack web-based pong game. Part of the 42 School curriculum

## Match Features
- Matches can have from **2 to 8 players**;
- Players can play against one another in **Friendly** or **Ranked** isolated matches, or in Swiss **Tournaments**;
- They can play in **couch-coop** or **remotely**;
- They can play against oneanother or against **bots**;
- They can further customize their game with **paddles**, **powerups**, **field-size** and **match duration**;

## Website features
- Users can **register** on the website and have all their matches saved;
- They can securely **login**, and choose to use **two-factor-authentication**;
- They can customize their profile, including name and avatar;
- They can check their **match and tournament history**;
- They can **Chat live** with other users;
- They can add, remove, or block **Friends**;
- They can choose the website's **Language** (Portuguese, English or Spanish);

## Technical characteristics
- Both frontend and Backend written in **TypeScript/JavaScript** using **Docker** as **microservices**;
- **Fastify** used as the main framework for backend. **Nginx** also used;
- **Tailwind** was used to design frontend;
- **SQLite** was used for the database, and **Redis** was used for temporary data-storing;
- **Prometheus** and **Grafana** were used for monitorization;
