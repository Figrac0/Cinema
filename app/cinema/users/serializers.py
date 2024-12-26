from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from users.models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password', 'confirm_password']

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Пароли не совпадают.'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = authenticate(email=email, password=password)
        if not user:
            raise serializers.ValidationError('Неверные учетные данные.')

        attrs['user'] = user
        return attrs
    


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        exclude = ['date_joined', 'last_login', 'is_superuser',
                   'email', 'is_staff', 'is_active',
                   'groups', 'user_permissions', 'password']


class UserReadSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        exclude = ['password', 'last_login', 'is_superuser',
                   'is_staff', 'is_active', 'groups', 'user_permissions',]
