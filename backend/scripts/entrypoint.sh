#!/bin/sh

set -e

python manage.py migrate
python manage.py collectstatic --noinput

daphne -b 0.0.0.0 -p 8000 Communicator.asgi:application