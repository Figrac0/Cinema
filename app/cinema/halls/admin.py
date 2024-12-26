from django.contrib import admin

from halls.models import Hall, HallType, SeatingTemplate, Zone, Hall


@admin.register(HallType)
class HallTypeAdmin(admin.ModelAdmin):
    list_display = ('type', 'price_coefficient')


@admin.register(SeatingTemplate)
class SeatingTemplateAdmin(admin.ModelAdmin):
    list_display = ('type', 'rows', 'columns')
    list_filter = ('rows', 'columns')


@admin.register(Zone)
class ZoneAdmin(admin.ModelAdmin):
    list_display = ('type', 'price_coefficient')


@admin.register(Hall)
class HallAdmin(admin.ModelAdmin):
    list_display = ('number', 'hall_type', 'seating_template')
    list_filter = ('hall_type', 'seating_template')
    search_fields = ('number',)
