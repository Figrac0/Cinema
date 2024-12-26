from django.apps import AppConfig


class SessionsMovieConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'sessions_movie'

    def ready(self):
        import sessions_movie.signals
