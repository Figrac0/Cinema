from django.db import models
from django.core.validators import MaxValueValidator


class HallType(models.Model):

    class Type(models.TextChoices):
        STANDARD = 'standard', 'Стандарт'
        COMFORT = 'comfort', 'Комфорт'
        VIP = 'vip', 'VIP'

    type = models.CharField(
        max_length=10,
        choices=Type.choices,
        unique=True,
        verbose_name="Тип зала"
    )
    price_coefficient = models.IntegerField(
        verbose_name="Коэффициент стоимости (%)",
        help_text="Укажите коэффициент стоимости от 0 до 20%.",
        validators=[MaxValueValidator(20)],
    )

    class Meta:
        verbose_name = "Тип зала с коэффициентом"
        verbose_name_plural = "Типы залов с коэффициентами"

    def __str__(self):
        return self.get_type_display()


class SeatingTemplate(models.Model):

    class Type(models.TextChoices):
        SMALL = 'small', 'Маленький'
        MEDIUM = 'medium', 'Средний'
        BIG = 'big', 'Большой'

    type = models.CharField(
        max_length=10,
        choices=Type.choices,
        unique=True,
        verbose_name="Тип шаблона"
    )
    rows = models.IntegerField(
        verbose_name="Кол-во рядов",
        validators=[MaxValueValidator(20)],
    )
    columns = models.IntegerField(
        verbose_name="Кол-во мест в ряду",
        validators=[MaxValueValidator(20)],
    )

    class Meta:
        verbose_name = "Шаблон расположения мест"
        verbose_name_plural = "Шаблоны расположения мест"

    def __str__(self):
        return self.type


class Zone(models.Model):

    class Type(models.TextChoices):
        MIDDLE = 'middle', 'Средняя зона'
        ORDINARY = 'ordinary', 'Обычная зона'

    type = models.CharField(
        max_length=10,
        choices=Type.choices,
        unique=True,
        verbose_name="Тип зоны"
    )
    price_coefficient = models.IntegerField(
        verbose_name="Коэффициент стоимости (%)",
        help_text="Укажите коэффициент стоимости от 0 до 20%.",
        validators=[MaxValueValidator(20)],
    )

    class Meta:
        verbose_name = "Зона"
        verbose_name_plural = "Зоны"

    def __str__(self):
        return self.get_type_display()


class Hall(models.Model):
    
    number =  models.IntegerField(
        verbose_name="Номер зала",
        unique=True,
        validators=[MaxValueValidator(10)],
    )
    hall_type = models.ForeignKey(
        HallType, 
        on_delete=models.CASCADE,
        verbose_name="Тип зала"
    )
    seating_template = models.ForeignKey(
        SeatingTemplate, 
        on_delete=models.SET_NULL, 
        null=True,
        blank=True,
        verbose_name="Шаблон расположения мест"
    )

    class Meta:
        verbose_name = 'Зал'
        verbose_name_plural = 'Залы'

    def __str__(self):
        return f"{self.number}"
