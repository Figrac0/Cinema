# Generated by Django 4.2.14 on 2024-12-21 12:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sessions_movie', '0006_remove_seat_is_reserved_booking_seat_booking'),
    ]

    operations = [
        migrations.AddField(
            model_name='booking',
            name='price',
            field=models.IntegerField(default=1, verbose_name='Стоимость'),
            preserve_default=False,
        ),
    ]
