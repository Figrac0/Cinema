from django.urls import include, path
from rest_framework.routers import DefaultRouter
from users import views as users_views
from movies import views as movies_views
from sessions_movie import views as session_views

router = DefaultRouter()

router.register('auth', users_views.AuthViewSet, basename='auth')
router.register('movies', movies_views.MovieViewSet, basename='movies')
router.register('sessions', session_views.SeatSessionViewSet, basename='sessions')
router.register('bookings', session_views.BookingViewSet, basename='bookings')

urlpatterns = [
    path('', include(router.urls)),
    path('user/', users_views.UserViewSet.as_view(
        {
            'get': 'retrieve',
            'patch': 'partial_update'
        }
    ), name='self-user'),
]
