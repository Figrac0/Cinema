# Generated by Django 4.2.14 on 2024-12-15 08:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('halls', '0003_halltype_seatingtemplate_zone_alter_hall_options_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='halltype',
            old_name='name',
            new_name='type',
        ),
        migrations.RemoveField(
            model_name='zone',
            name='name',
        ),
        migrations.AddField(
            model_name='zone',
            name='type',
            field=models.CharField(choices=[('middle', 'Средняя зона'), ('ordinary', 'Обычная зона')], default=1, max_length=100, unique=True, verbose_name='Тип зоны'),
            preserve_default=False,
        ),
    ]
