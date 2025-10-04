from django.urls import path, include
from . import views
# from dj_rest_auth.views import PasswordResetConfirmView


urlpatterns = [
    path('csrf-token/', views.csrf_token, name='csrf-token'),
    # path('password/reset/confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('', include('dj_rest_auth.urls')),
    path('registration/', include('dj_rest_auth.registration.urls'))
]