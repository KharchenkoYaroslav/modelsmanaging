import pytest
from rest_framework.test import APIClient
from django.contrib.auth.models import User

@pytest.fixture
def api_client_unit():
    return APIClient()

@pytest.fixture
def mock_user():
    return User.objects.create_user(username='testuser', password='password')