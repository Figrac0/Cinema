from django import forms
from django.contrib import admin
from django.core.exceptions import ValidationError
from datetime import timedelta
from movies import models


class DirectorForm(forms.ModelForm):
    class Meta:
        model = models.Director
        fields = '__all__'

    def clean(self):
        cleaned_data = super().clean()
        if models.Director.objects.count() >= 25 and not self.instance.pk:
            raise ValidationError("Максимальное количество режиссеров — 25.")
        return cleaned_data


@admin.register(models.Director)
class DirectorAdmin(admin.ModelAdmin):
    form = DirectorForm
    list_display = (
        'pk',
        'first_name',
        'last_name',
    )
    search_fields = ('last_name',)


class CountryForm(forms.ModelForm):
    class Meta:
        model = models.Country
        fields = '__all__'

    def clean(self):
        cleaned_data = super().clean()
        if models.Country.objects.count() >= 15 and not self.instance.pk:
            raise ValidationError("Максимальное количество стран — 15.")
        return cleaned_data


@admin.register(models.Country)
class CountryAdmin(admin.ModelAdmin):
    form = CountryForm
    list_display = (
        'pk',
        'name',
    )
    search_fields = ('name',)


class GenreForm(forms.ModelForm):
    class Meta:
        model = models.Genre
        fields = '__all__'

    def clean(self):
        cleaned_data = super().clean()
        if models.Genre.objects.count() >= 25 and not self.instance.pk:
            raise ValidationError("Максимальное количество жанров — 25.")
        return cleaned_data


@admin.register(models.Genre)
class GenreAdmin(admin.ModelAdmin):
    form = GenreForm
    list_display = (
        'pk',
        'name',
    )
    search_fields = ('name',)


@admin.register(models.Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = (
        'pk',
        'name',
        'release_year',
        'country',
    )
    search_fields = ('name',)
