from datetime import timedelta
from django.db import models
from django.core.validators import (
    MinLengthValidator,
    MaxLengthValidator,
    MinValueValidator,
    MaxValueValidator
)
from django.core.exceptions import ValidationError


class Director(models.Model):
    first_name = models.CharField(
        max_length=20,
        validators=[
            MinLengthValidator(2, "Минимальная длина имени — 2 символа"),
        ],
        verbose_name="Имя"
    )
    last_name = models.CharField(
        max_length=30,
        validators=[
            MinLengthValidator(2, "Минимальная длина фамилии — 2 символа"),
        ],
        verbose_name="Фамилия"
    )

    class Meta:
        ordering = ['last_name']
        verbose_name = "Режиссер"
        verbose_name_plural = "Режиссеры"
        unique_together = ['first_name', 'last_name',]

    def __str__(self):
        return self.last_name


class Country(models.Model):
    name = models.CharField(
        max_length=60,
        unique=True,
        verbose_name="Страна"
    )

    class Meta:
        ordering = ['name']
        verbose_name = "Страна"
        verbose_name_plural = "Страны"

    def __str__(self):
        return self.name


class Genre(models.Model):
    name = models.CharField(
        max_length=50,
        unique=True,
        verbose_name="Жанр"
    )

    class Meta:
        ordering = ['name']
        verbose_name = "Жанр"
        verbose_name_plural = "Жанры"

    def __str__(self):
        return self.name


class Movie(models.Model):

    class AgeLimit(models.IntegerChoices):
        ZERO_PLUS = 0, "0+"
        SIX_PLUS = 6, "6+"
        TWELVE_PLUS = 12, "12+"
        SIXTEEN_PLUS = 16, "16+"
        EIGHTEEN_PLUS = 18, "18+"

    name = models.CharField(
        max_length=50,
        validators=[
            MinLengthValidator(3, "Минимальная длина названия фильма — 3 символов"),
            MaxLengthValidator(50, "Максимальная длина названия фильма — 50 символов"),
        ],
        verbose_name="Название"
    )
    image = models.ImageField(
        upload_to="images/"
    )
    release_year = models.PositiveIntegerField(
        verbose_name="Год выпуска"
    )
    annotation = models.TextField(
        validators=[
            MinLengthValidator(100, "Минимальная длина аннотации — 100 символов"),
            MaxLengthValidator(300, "Максимальная длина аннотации — 300 символов"),
        ],
        verbose_name="Аннотация"
    )
    genres = models.ManyToManyField(
        Genre,
        related_name="movies",
        verbose_name="Жанры"
    )
    duration = models.IntegerField(
        verbose_name="Длительность (минуты)",
        validators=[MaxValueValidator(360)],
        help_text="Максимальная продолжительность фильма — 360 минут"
    )
    director = models.ForeignKey(
        Director,
        on_delete=models.SET_NULL,
        null=True,
        verbose_name="Режиссер"
    )
    country = models.ForeignKey(
        Country,
        on_delete=models.SET_NULL,
        null=True,
        verbose_name="Страна"
    )
    age_limit = models.PositiveSmallIntegerField(
        choices=AgeLimit.choices,
        verbose_name="Возрастное ограничение"
    )
    base_ticket_price = models.IntegerField(
        validators=[MinValueValidator(200)],
        verbose_name="Базовая стоимость билета"
    )

    class Meta:
        ordering = ['name', 'release_year']
        verbose_name = "Фильм"
        verbose_name_plural = "Фильмы"

    def __str__(self):
        return f"{self.name} ({self.release_year})"
