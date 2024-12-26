from django.contrib import admin

from users.models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        'pk',
        'first_name',
        'last_name',
        'email'
    )
    exclude = ('password', 'last_login', 'is_superuser',
               'is_staff', 'is_active', 'groups', 'user_permissions',)
    # readonly_fields = ('telegram_id', 'chat_id', 'username', 'phone',)

