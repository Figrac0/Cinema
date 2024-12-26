import os
from api.permissions import IsOwnerOrReadOnly
from django.contrib.auth import get_user_model
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from users.serializers import (
    UserReadSerializer,
    UserSerializer,
    RegisterSerializer,
    LoginSerializer
)

env = os.environ

User = get_user_model()


class AuthViewSet(viewsets.ViewSet):

    def create(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({'message': 'Регистрация успешна'}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)


class UserViewSet(mixins.RetrieveModelMixin,
                  mixins.UpdateModelMixin,
                  viewsets.GenericViewSet):

    permission_classes = [IsOwnerOrReadOnly, ]
    queryset = User.objects.all()

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UserReadSerializer
        return UserSerializer
