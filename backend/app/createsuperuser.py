'''
Automatic super user creation script.
Works only if no users in database. This is a security feature to
make creating next super users intentional, not automatic.
'''
from django.contrib.auth import get_user_model
from os import environ

User = get_user_model()
if not User.objects.all():
    superuser = User.objects.create_superuser(
        username=environ.get('DJANGO_SUPERUSER_USERNAME', default="admin"),
        email=environ.get('DJANGO_SUPERUSER_EMAIL', default="admin@example.com"),
        password=environ.get('DJANGO_SUPERUSER_PASSWORD', default="insecurepassword"))
    superuser.save()
    print(f"Super User with username {environ.get('DJANGO_SUPERUSER_USERNAME')} created")
