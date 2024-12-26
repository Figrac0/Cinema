from django.contrib.auth.models import AbstractUser
from django.core.validators import MinLengthValidator, MaxLengthValidator
from django.db import models
from phonenumber_field.modelfields import PhoneNumberField
from rest_framework_simplejwt.tokens import RefreshToken
from users.manager import UserManager


class User(AbstractUser):

    username = None
    email = models.EmailField(
        unique=True,
        validators=[
            MinLengthValidator(6, "Минимальная длина email — 6 символов"),
            MaxLengthValidator(30, "Максимальная длина email — 30 символов"),
        ]
    )
    phone = PhoneNumberField(
        unique=True,
        null=True,
        blank=True
    )
    password = models.CharField(
        max_length=128,
        validators=[
            MinLengthValidator(8, "Минимальная длина пароля — 8 символов"),
            MaxLengthValidator(20, "Максимальная длина пароля — 20 символов"),
        ]
    )
    first_name = models.CharField(
        max_length=20,
        validators=[
            MinLengthValidator(2, "Минимальная длина имени — 2 символа"),
        ]
    )
    last_name = models.CharField(
        max_length=30,
        validators=[
            MinLengthValidator(2, "Минимальная длина фамилии — 2 символа"),
        ]
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

    objects = UserManager()

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    def get_token(self):
        refresh = RefreshToken.for_user(self)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
