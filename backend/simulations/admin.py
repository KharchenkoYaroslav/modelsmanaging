from django.contrib import admin
from .models import Simulation


@admin.register(Simulation)
class SimulationAdmin(admin.ModelAdmin):
    list_display = ('user', 'model_type', 'created_at', 'is_stable')
    list_filter = ('model_type', 'user', 'is_stable', 'created_at')
    search_fields = ('user__username', 'model_type')
    readonly_fields = ('created_at',)