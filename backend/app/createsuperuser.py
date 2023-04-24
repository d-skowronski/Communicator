from django.db import IntegrityError
from django.contrib.auth import get_user_model
from os import environ

try:
    User = get_user_model()
    superuser = User.objects.create_superuser(
        username=environ.get('SUPER_USER_NAME', default="admin"),
        email=environ.get('SUPER_USER_EMAIL', default="admin@example.com"),
        password=environ.get('SUPER_USER_PASSWORD', default="insecurepassword"))
    superuser.save()
    print(f"Super User with username {environ.get('SUPER_USER_NAME')} created")
except IntegrityError:
    print(f"Super User with username {environ.get('SUPER_USER_NAME')} exists!")
