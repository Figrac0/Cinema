# Generated by Django 4.2.14 on 2024-12-15 10:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sessions_movie', '0002_seat'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='session',
            options={'ordering': ['start_time'], 'verbose_name': 'Сеанс', 'verbose_name_plural': 'Сеансы'},
        ),
        migrations.RenameField(
            model_name='session',
            old_name='datetime',
            new_name='start_time',
        ),
        migrations.AddField(
            model_name='session',
            name='end_time',
            field=models.DateTimeField(editable=False, null=True, verbose_name='Время окончания сеанса'),
        ),
    ]