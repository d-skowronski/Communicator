from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    profile_picture = models.ImageField(upload_to="profile_pictures", default='noimage.png')
    email = models.EmailField(max_length=64, unique=True)
    username = models.CharField(max_length=32,unique=True)
    def __str__(self):
        return self.username

class Room(models.Model):
    name = models.CharField(max_length=128, default=None, null=True, blank=True)
    users = models.ManyToManyField(User, related_name='chat_rooms')
    thumbnail = models.ImageField(upload_to="profile_pictures", blank=True, null=True, default=None)

    # Return first user from Room users that is not current_user
    # If no more users found returns current_user
    def getDisplayUser(self, current_user):
        displayUser = self.users.exclude(pk=current_user.pk)
        if displayUser:
            return displayUser[0]
        return current_user

    def usernamesList(self):
        return list(self.users.all().values_list('username', flat=True))

    def __str__(self):
        if self.name:
            return self.name
        return ' '.join(self.usernamesList())


class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages')
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='messages')
    content_text = models.CharField(max_length=512)
    date = models.DateTimeField(auto_now_add=True)
    read_by = models.ManyToManyField(User, related_name='read_messages', blank=True)

    def __str__(self):
        return f'Room: {self.room}, Sender: {self.sender}; {self.content_text}'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.read_by.all():
            self.read_by.add(self.sender)

