#!/bin/sh

set -e

python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py shell < createsuperuser.py
daphne -b 0.0.0.0 -p 8000 Communicator.asgi:application