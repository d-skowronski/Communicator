# Generated by Django 4.1.5 on 2023-01-17 10:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Chat', '0009_alter_message_readby'),
    ]

    operations = [
        migrations.RenameModel('ChatRoom', 'Room')
    ]