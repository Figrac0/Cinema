# Generated by Django 4.2.14 on 2024-12-15 12:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sessions_movie', '0004_alter_session_start_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='session',
            name='end_time',
            field=models.DateTimeField(null=True, verbose_name='Время окончания сеанса'),
        ),
    ]
