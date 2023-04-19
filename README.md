
# Communicator

Fullstack web application. Facebook Messenger clone. Made in Django and React with PostreSQL database. 


## Features

- Real time chat
- Real time updates for friend lists and seen messages
- Looking for and adding new friends
- Saving messages and retriving them via API from database, inifite scroll
- JSON Web Token authentication for API and WebSocket connection
- Responsiveness, with URL routing dependent on screen size for better experience
- Dockerized with separate docker compose files for development and production
- nginx reverse proxy serving static and media files in production
## Screenshots

![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)


## Technology stack

Backend:
- Django - backend
- DRF - API 
- DRF Simple JWT - JSON Web Token authentication
- Django Channels - WebSocket

Frontend:
- React - frontend
- React Query - managing API and WebSocket data
- Axios - handling authentication header for API calls
- Jotai - passing state without prop drilling
- React Router DOM - handling paths

Other:
- PostgreSQL - database
- Docker - containerization
- nginx - reverse proxy

Full list of dependencies can be found in requirements.txt (backend) and package.json (frontend)
## Run production build

Clone the project

```bash
  git clone https://github.com/d-skowronski/Communicator.git
```

Go to the project directory

```bash
  cd Communicator
```

Start docker compose

```bash
  docker compose -f docker-compose-prod.yml up
```

Connect at http://localhost

In case of production build there is an nginx server, providing the whole app on a single adress. 

If app was to be deployed on server, you need to customize enviromental variables in docker-compose-prod.yml. This is critical especially in case of SECRET_KEY that Django uses. 


## Run development build

Clone and cd into the project as described before

Start docker compose

```bash
  docker compose -f docker-compose-dev.yml up
```

Connect at http://localhost:3000

