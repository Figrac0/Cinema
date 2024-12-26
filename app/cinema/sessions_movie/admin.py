from datetime import timedelta

from django import forms
from django.core.exceptions import ValidationError
from django.contrib import admin
from django.utils.timezone import now

from sessions_movie.models import Session, Seat, Booking


class SessionForm(forms.ModelForm):
    class Meta:
        model = Session
        fields = '__all__'

    def clean(self):
        cleaned_data = super().clean()
        start_time = cleaned_data.get("start_time")
        hall = cleaned_data.get("hall")
        movie = cleaned_data.get("movie")
        print(start_time)

        if not start_time or not hall or not movie:
            print(123)
            return cleaned_data

        if start_time < now():
            raise ValidationError(
                "Время начала сеанса не может быть в прошлом."
            )

        end_time = start_time + timedelta(minutes=movie.duration + 10)

        overlapping_sessions = Session.objects.filter(
            hall=hall,
            start_time__lt=end_time,
            end_time__gt=start_time
        ).exclude(pk=self.instance.pk)

        if overlapping_sessions.exists():
            raise ValidationError(
                "Этот сеанс пересекается с другим сеансом в этом зале."
            )
        print(321)

        return cleaned_data


class SeatInline(admin.TabularInline):
    model = Seat
    classes = ['collapse']
    extra = 0
    fields = ('row', 'column', 'zone', 'booking')
    readonly_fields = ('row', 'column', 'zone', 'booking')
    can_delete = False
    max_num = 0


@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    form = SessionForm
    list_display = ("id", "start_time", "end_time", 'hall', 'movie')
    inlines = [SeatInline]

    search_fields = ('movie__title',)
    list_filter = ('hall', 'start_time')
    readonly_fields = ("end_time", )


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    form = SessionForm
    list_display = ("id", "user", "status", 'booked_at')
    inlines = [SeatInline]
