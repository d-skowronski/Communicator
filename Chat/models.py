from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    profilePicture = models.ImageField(upload_to="profile_pictures", default='noimage.png')
    email = models.EmailField(max_length=64, unique=True)
    username = models.CharField(max_length=32,unique=True)
    def __str__(self):
        return self.username