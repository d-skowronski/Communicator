# Generated by Django 4.1.5 on 2023-02-17 09:44

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('Chat', '0012_rename_readby_message_read_by'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='created',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
