# Generated by Django 4.1.5 on 2023-01-17 10:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Chat', '0010_auto_20230117_1000'),
    ]

    operations = [
        migrations.RenameField(
            model_name='message',
            old_name='content',
            new_name='content_text',
        ),
        migrations.RenameField(
            model_name='user',
            old_name='profilePicture',
            new_name='profile_picture',
        ),
        migrations.AddField(
            model_name='room',
            name='thumbnail',
            field=models.ImageField(blank=True, default=None, null=True, upload_to='profile_pictures'),
        ),
    ]