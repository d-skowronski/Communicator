# Generated by Django 4.0.4 on 2022-11-16 08:02

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Chat', '0006_alter_chatroom_users'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='readBy',
            field=models.ManyToManyField(default=(), related_name='read_messages', to=settings.AUTH_USER_MODEL),
        ),
    ]
