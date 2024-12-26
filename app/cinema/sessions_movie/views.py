from datetime import datetime
from rest_framework import mixins, viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from sessions_movie.serializers import (
    SeatSessionSerializer,
    BookingCreateSerializer,
    BookingCancelSerializer, 
    BookingReadSerializer
)
from sessions_movie.models import Session, Booking, Seat


class SeatSessionViewSet(mixins.RetrieveModelMixin,
                         viewsets.GenericViewSet):

    filter_backends = [DjangoFilterBackend]
    serializer_class = SeatSessionSerializer

    def get_queryset(self):
        now = datetime.now()
        return Session.objects.filter(start_time__gt=now).distinct()


class BookingViewSet(viewsets.ModelViewSet):

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action in ('retrieve', 'list'):
            return BookingReadSerializer
        return BookingCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data,
            context={'user': request.user}
        )
        serializer.is_valid(raise_exception=True)
        seats = serializer.validated_data['seats']
        session = seats[0].session
        if any(seat.session != session for seat in seats):
            return Response(
                {'detail': "Все выбранные места должны быть с одного и того же сеанса."},
                status=status.HTTP_400_BAD_REQUEST
            )

        occupied_seats = [seat for seat in seats if seat.booking is not None]

        if occupied_seats:
            occupied_seat_numbers = ', '.join([
                f"{seat.id}" for seat in occupied_seats
            ])
            return Response(
                {'detail': f"Места {occupied_seat_numbers} уже забронированы."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        total_price = sum([seat.get_final_price() for seat in seats])

        booking = Booking.objects.create(
            user=request.user, price=total_price, session=session
        )
        for seat in seats:
            seat.booking = booking
            seat.save()

        return Response({"status": "success"}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        booking = self.get_object()

        if booking.status == Booking.Status.CANCELLED:
            return Response(
                {'status': 'Уже отменено'},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = Booking.Status.CANCELLED
        booking.save()

        if booking.seat_set.exists():
            for seat in booking.seat_set.all():
                seat.booking = None
                seat.save()

        return Response({'status': 'cancelled'}, status=status.HTTP_200_OK)
