from django.urls import path
from .views import SimulationCreateView, SimulationHistoryView, SimulationDetailView


urlpatterns = [
    path('create/', SimulationCreateView.as_view(), name='simulation-create'),
    path('history/', SimulationHistoryView.as_view(), name='simulation-history'),
    path('detail/<int:pk>/', SimulationDetailView.as_view(), name='simulation-detail')
]