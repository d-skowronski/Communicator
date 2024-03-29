# Generated by Django 4.0.4 on 2022-11-16 08:04

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Chat', '0007_message_readby'),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='readBy',
            field=models.ManyToManyField(default=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages', to=settings.AUTH_USER_MODEL), related_name='read_messages', to=settings.AUTH_USER_MODEL),
        ),
    ]
