# Generated by Django 4.2.14 on 2024-12-21 09:07

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('sessions_movie', '0005_alter_session_end_time'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='seat',
            name='is_reserved',
        ),
        migrations.CreateModel(
            name='Booking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('reserved', 'Забронировано'), ('cancelled', 'Отменено')], default='reserved', max_length=10, verbose_name='Статус')),
                ('booked_at', models.DateTimeField(auto_now_add=True, verbose_name='Дата бронирования')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Пользователь')),
            ],
            options={
                'verbose_name': 'Бронирование',
                'verbose_name_plural': 'Бронирования',
            },
        ),
        migrations.AddField(
            model_name='seat',
            name='booking',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='sessions_movie.booking', verbose_name='Бронь'),
        ),
    ]