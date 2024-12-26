from django.utils import timezone
from rest_framework import serializers
from sessions_movie.models import Session, Seat, Booking
from halls.models import Zone

class SessionSerializer(serializers.ModelSerializer):

    minimum_ticket_price = serializers.SerializerMethodField()
    hall_type = serializers.SerializerMethodField()

    class Meta:
        model = Session
        fields = ["id", "start_time", "minimum_ticket_price", "hall_type"]


    def get_minimum_ticket_price(self, obj):
        base_ticket_price = obj.movie.base_ticket_price

        hall_coefficient = obj.hall.hall_type.price_coefficient / 100

        min_zone_coefficient = Zone.objects.all().order_by(
            'price_coefficient'
        ).first().price_coefficient / 100

        min_price = base_ticket_price * (1 + hall_coefficient + min_zone_coefficient)
        
        return round(min_price)
    
    def get_hall_type(self, obj):
        return obj.hall.hall_type.get_type_display()


class SeatSerializer(serializers.ModelSerializer):

    price = serializers.SerializerMethodField()
    zone = serializers.CharField(source='zone.type')
    booked = serializers.SerializerMethodField()

    class Meta:
        model = Seat
        fields = ["id", "row", "column", "zone", "booked", "price"]

    def get_price(self, obj):
        base_ticket_price = obj.session.movie.base_ticket_price
        hall_coefficient = obj.session.hall.hall_type.price_coefficient / 100
        zone_coefficient = obj.zone.price_coefficient / 100
        return round(base_ticket_price * (1 + hall_coefficient + zone_coefficient))
    
    def get_booked(self, obj):
        return obj.booking is not None


class ShortSessionsSeializer(serializers.ModelSerializer):

    class Meta:
        model = Session
        fields = ["id", "start_time"]


class SeatSessionSerializer(serializers.ModelSerializer):

    movie_name = serializers.CharField(source='movie.name')
    hall_type = serializers.SerializerMethodField()
    hall_number = serializers.CharField(source='hall.number')
    rows = serializers.CharField(source='hall.seating_template.rows')
    columns = serializers.CharField(source='hall.seating_template.columns')
    ordinary_price = serializers.SerializerMethodField()
    middle_price = serializers.SerializerMethodField()
    other_sessions = serializers.SerializerMethodField()
    seats = SeatSerializer(many=True)

    class Meta:
        model = Session
        fields = [
            "id",
            "movie_name",
            "start_time",
            "hall_type",
            "rows",
            "columns",
            "hall_number",
            "ordinary_price",
            "middle_price",
            "other_sessions",
            "seats"
        ]

    def get_hall_type(self, obj):
        return obj.hall.hall_type.get_type_display()
    
    def get_ordinary_price(self, obj):
        return self._calculate_price_by_zone(obj, Zone.Type.ORDINARY)

    def get_middle_price(self, obj):
        return self._calculate_price_by_zone(obj, Zone.Type.MIDDLE)
    
    def get_other_sessions(self, obj):
        session_date = obj.start_time.date()
        other_sessions = Session.objects.filter(
            movie=obj.movie,
            start_time__date=session_date
        )

        return ShortSessionsSeializer(other_sessions, many=True).data

    def _calculate_price_by_zone(self, session, zone_type):
        base_ticket_price = session.movie.base_ticket_price
        hall_coefficient = session.hall.hall_type.price_coefficient
        zone_coefficient = Zone.objects.get(type=zone_type).price_coefficient
        total_coefficient = 1 + (hall_coefficient / 100) + (zone_coefficient / 100)
        return round(base_ticket_price * total_coefficient)
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['seats'] = sorted(representation['seats'], key=lambda seat: seat['id'])
        return representation

class BookingReadSerializer(serializers.ModelSerializer):

    seats = serializers.SerializerMethodField()
    movie_name = serializers.CharField(source='session.movie.name')
    start_time = serializers.CharField(source='session.start_time')
    status = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            'id',
            'seats',
            'status',
            'price',
            'booked_at',
            'movie_name',
            'start_time'
        ]

    def get_seats(self, obj):
        return [{
            'id': seat.id,
            'row': seat.row,
            'column': seat.column
        } for seat in obj.seat_set.all()]

    def get_status(self, obj):
        if obj.session.start_time <= timezone.now() and obj.status != Booking.Status.CANCELLED:
            return "completed"
        return obj.status

class BookingCreateSerializer(serializers.ModelSerializer):

    seats = serializers.PrimaryKeyRelatedField(
        queryset=Seat.objects.all(),
        many=True,
        write_only=True
    )
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = Booking
        fields = ['seats', 'status', 'user', 'booked_at']
        read_only_fields = ['status', 'booked_at']


class BookingCancelSerializer(serializers.ModelSerializer):

    class Meta:
        model = Booking
        fields = ['status']