# Generated by Django 4.2.14 on 2024-11-10 07:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('halls', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='hall',
            name='number',
            field=models.CharField(default=1, max_length=5),
            preserve_default=False,
        ),
    ]
