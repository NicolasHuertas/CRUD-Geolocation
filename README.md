# CRUD-Geolocation

Basic Geolocation service.
Places with their name, description and address are stored in a postgreSQL database and displayed on a map using the reverse geocoding service provided by mapboxgl.

##To run backend
First set up migrations
```
python manage.py makemigrations
python manage.py migrate
```

Run backend server locally
```
python manage.py runserver
```

##To run frontend
```
cd frontend
npm install
npm run dev
```
