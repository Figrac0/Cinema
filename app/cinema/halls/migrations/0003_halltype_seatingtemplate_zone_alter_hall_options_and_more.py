# Generated by Django 4.2.14 on 2024-12-15 08:16

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('halls', '0002_hall_number'),
    ]

    operations = [
        migrations.CreateModel(
            name='HallType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(choices=[('standard', 'Стандарт'), ('comfort', 'Комфорт'), ('vip', 'VIP')], max_length=10, unique=True, verbose_name='Тип зала')),
                ('price_coefficient', models.IntegerField(help_text='Укажите коэффициент стоимости от 0 до 20%.', validators=[django.core.validators.MaxValueValidator(20)], verbose_name='Коэффициент стоимости (%)')),
            ],
            options={
                'verbose_name': 'Тип зала с коэффициентом',
                'verbose_name_plural': 'Типы залов с коэффициентами',
            },
        ),
        migrations.CreateModel(
            name='SeatingTemplate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('rows', models.IntegerField(validators=[django.core.validators.MaxValueValidator(20)], verbose_name='Кол-во рядов')),
                ('columns', models.IntegerField(validators=[django.core.validators.MaxValueValidator(20)], verbose_name='Кол-во мест в ряду')),
                ('description', models.TextField()),
            ],
            options={
                'verbose_name': 'Шаблон расположения мест',
                'verbose_name_plural': 'Шаблоны расположения мест',
            },
        ),
        migrations.CreateModel(
            name='Zone',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Название зоны')),
                ('price_coefficient', models.IntegerField(help_text='Укажите коэффициент стоимости от 0 до 20%.', validators=[django.core.validators.MaxValueValidator(20)], verbose_name='Коэффициент стоимости (%)')),
            ],
            options={
                'verbose_name': 'Зона',
                'verbose_name_plural': 'Зоны',
            },
        ),
        migrations.AlterModelOptions(
            name='hall',
            options={'verbose_name': 'Зал', 'verbose_name_plural': 'Залы'},
        ),
        migrations.AlterField(
            model_name='hall',
            name='number',
            field=models.IntegerField(validators=[django.core.validators.MaxValueValidator(10)], verbose_name='Номер зала'),
        ),
        migrations.AddField(
            model_name='hall',
            name='hall_type',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='halls.halltype', verbose_name='Тип зала'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='hall',
            name='seating_template',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='halls.seatingtemplate', verbose_name='Шаблон расположения мест'),
        ),
    ]
