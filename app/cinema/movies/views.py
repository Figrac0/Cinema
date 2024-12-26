from datetime import datetime
from django_filters.rest_framework import DjangoFilterBackend
from movies.models import Movie
from movies.serializers import (
    MovieSerializer
)
from rest_framework import mixins, viewsets

from .models import Movie
from .serializers import MovieSerializer

class MovieViewSet(mixins.ListModelMixin,
                   mixins.RetrieveModelMixin,
                   viewsets.GenericViewSet):

    filter_backends = [DjangoFilterBackend]
    
    def get_queryset(self):
        queryset = Movie.objects.prefetch_related('session')
        now = datetime.now()
        queryset = queryset.filter(session__start_time__gt=now).distinct()
        return queryset

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return MovieSerializer
        return MovieSerializer
