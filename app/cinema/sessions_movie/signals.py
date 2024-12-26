from django.db.models.signals import post_save
from django.dispatch import receiver

from sessions_movie.models import Session, Seat
from halls.models import Zone

@receiver(post_save, sender=Session)
def create_seats_for_session(sender, instance, created, **kwargs):
    if created:
        seating_template = instance.hall.seating_template
        rows = seating_template.rows
        middle_start = rows // 3
        middle_end = rows - middle_start
        for row in range(seating_template.rows):
            for column in range(seating_template.columns):
                if middle_start <= row < middle_end:
                    zone = Zone.objects.get(type=Zone.Type.MIDDLE)
                else:
                    zone = Zone.objects.get(type=Zone.Type.ORDINARY)
                Seat.objects.create(
                    session=instance,
                    row=row+1,
                    column=column+1,
                    zone=zone
                )
