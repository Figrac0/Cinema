from datetime import timedelta

from django.db import models
from django.contrib.auth import get_user_model
from movies.models import Movie
from halls.models import Hall, Zone

User = get_user_model()

class Session(models.Model):

    hall = models.ForeignKey(
        Hall,
        verbose_name="Зал",
        related_name="session",
        on_delete=models.CASCADE
    )
    movie = models.ForeignKey(
        Movie,
        verbose_name="Фильм",
        related_name="session",
        on_delete=models.CASCADE
    )
    start_time = models.DateTimeField(
        verbose_name="Время начала сеанса"
    )
    end_time = models.DateTimeField(
        verbose_name="Время окончания сеанса",
        null=True
    )

    class Meta:
        ordering = ['start_time', ]
        verbose_name = 'Сеанс'
        verbose_name_plural = 'Сеансы'

    def __str__(self):
        return f'Зал: {self.hall} - Фильм: {self.movie}'
    
    def save(self, *args, **kwargs):
        self.end_time = self.start_time + timedelta(
            minutes=self.movie.duration + 10
        )
        super().save(*args, **kwargs)


class Booking(models.Model):

    class Status(models.TextChoices):
        RESERVED = "reserved", "Забронировано"
        CANCELLED = "cancelled", "Отменено"

    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.RESERVED,
        verbose_name="Статус"
    )
    session = models.ForeignKey(
        Session,
        verbose_name="Сеанс",
        on_delete=models.CASCADE
    )
    user = models.ForeignKey(
        User,
        verbose_name="Пользователь",
        on_delete=models.CASCADE
    )
    price = models.IntegerField(
        verbose_name="Стоимость",
    )
    booked_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Дата бронирования"
    )

    class Meta:
        verbose_name = "Бронирование"
        verbose_name_plural = "Бронирования"

    def __str__(self):
        return f"{self.id}: {self.user}"


class Seat(models.Model):

    session = models.ForeignKey(
        Session,
        verbose_name="Сеанс",
        related_name="seats",
        on_delete=models.CASCADE
    )
    row = models.IntegerField(
        verbose_name="Ряд"
    )
    column = models.IntegerField(
        verbose_name="Место в ряду"
    )
    zone = models.ForeignKey(
        Zone,
        verbose_name="Зона",
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    booking = models.ForeignKey(
        Booking,
        verbose_name="Бронь",
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    class Meta:
        verbose_name = "Место"
        verbose_name_plural = "Места"
        unique_together = ('session', 'row', 'column')

    def __str__(self):
        return f"Место {self.row}-{self.column}"
    
    def get_final_price(self):
        total_coefficient =  1 + (
            self.zone.price_coefficient / 100
        ) + (
            self.session.hall.hall_type.price_coefficient / 100
        )
        return round(self.session.movie.base_ticket_price * total_coefficient)