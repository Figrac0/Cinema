# Generated by Django 4.2.14 on 2024-12-15 06:41

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_alter_user_managers'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='email',
            field=models.EmailField(max_length=254, unique=True, validators=[django.core.validators.MinLengthValidator(6, 'Минимальная длина email — 6 символов'), django.core.validators.MaxLengthValidator(30, 'Максимальная длина email — 30 символов')]),
        ),
        migrations.AlterField(
            model_name='user',
            name='first_name',
            field=models.CharField(max_length=20, validators=[django.core.validators.MinLengthValidator(2, 'Минимальная длина имени — 2 символа')]),
        ),
        migrations.AlterField(
            model_name='user',
            name='last_name',
            field=models.CharField(max_length=30, validators=[django.core.validators.MinLengthValidator(2, 'Минимальная длина фамилии — 2 символа')]),
        ),
        migrations.AlterField(
            model_name='user',
            name='password',
            field=models.CharField(max_length=128, validators=[django.core.validators.MinLengthValidator(8, 'Минимальная длина пароля — 8 символов'), django.core.validators.MaxLengthValidator(20, 'Максимальная длина пароля — 20 символов')]),
        ),
    ]
