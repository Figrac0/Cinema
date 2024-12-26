from datetime import datetime

from rest_framework import serializers
from movies.models import Movie, Director, Country, Genre
from sessions_movie.serializers import SessionSerializer


class DirectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Director
        fields = ['first_name', 'last_name']


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['name']

class MovieSerializer(serializers.ModelSerializer):

    sessions = serializers.SerializerMethodField()
    director = DirectorSerializer()
    country = serializers.CharField(source='country.name')
    genres = GenreSerializer(many=True)

    class Meta:
        model = Movie
        fields = "__all__"

    def get_sessions(self, obj):
        now = datetime.now()
        upcoming_sessions = obj.session.filter(start_time__gt=now)
        return SessionSerializer(upcoming_sessions, many=True).data