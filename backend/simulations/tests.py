import os
import sys
import django
from pathlib import Path

current_dir = Path(__file__).resolve().parent
root_dir = current_dir.parent
sys.path.append(str(root_dir))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

import pytest
from unittest.mock import patch
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from simulations.models import Simulation

pytestmark = pytest.mark.django_db

@pytest.fixture
def api_client_unit():
    return APIClient()

@pytest.fixture
def mock_user():
    return User.objects.create_user(username='testuser', password='password')

class TestSimulationCreateViewUnit:
    @patch('simulations.views.physics.lorenz_attractor')
    def test_create_lorenz_simulation_success_unit(self, mock_lorenz, mock_user, api_client_unit):
        mock_lorenz.return_value = {'stable': True, 'points': [(1, 2, 3), (4, 5, 6)]}
        
        url = reverse('simulation-create')
        data = {
            "model": "lorenz",
            "steps": 1000,
            "color": "#ff0000",
            "params": {
                "sigma": 10.0, "rho": 28.0, "beta": 2.667, 
                "dt": 0.01, "initial": [1, 1, 1]
            }
        }
        
        api_client_unit.force_authenticate(user=mock_user)

        response = api_client_unit.post(url, data, format='json')

        assert response.status_code == status.HTTP_201_CREATED, "Статус-код має бути 201 CREATED"
        
        assert Simulation.objects.count() == 1
        simulation = Simulation.objects.first()
        assert simulation.user == mock_user
        assert simulation.model_type == 'lorenz'
        assert simulation.results['color'] == '#ff0000'
        mock_lorenz.assert_called_once()

        assert "results" in response.data
        assert response.data["model_type"] == "lorenz"
        assert response.data["is_stable"] is True

    @patch('simulations.views.physics.henon_map')
    def test_create_unstable_simulation_unit(self, mock_henon, mock_user, api_client_unit):
        mock_henon.return_value = {'stable': False, 'points': []}

        url = reverse('simulation-create')
        data = {
            "model": "henon",
            "steps": 1500,
            "color": "#00ff00",
            "params": {"a": 1.4, "b": 0.3, "initial": [0.1, 0.1]}
        }
        api_client_unit.force_authenticate(user=mock_user)

        response = api_client_unit.post(url, data, format='json')

        assert response.status_code == status.HTTP_201_CREATED, "Статус-код все одно має бути 201"
        assert Simulation.objects.count() == 1
        simulation = Simulation.objects.first()
        assert simulation.user == mock_user
        assert simulation.model_type == 'henon'
        assert simulation.is_stable is False
        mock_henon.assert_called_once()
        assert response.data["is_stable"] is False

    def test_create_simulation_unauthenticated_unit(self, api_client_unit):
        url = reverse('simulation-create')
        data = {"model": "lorenz", "params": {}}
        response = api_client_unit.post(url, data, format='json')

        assert response.status_code == status.HTTP_403_FORBIDDEN, "Має бути помилка 403 FORBIDDEN"

    def test_create_simulation_invalid_params_unit(self, mock_user, api_client_unit):
        url = reverse('simulation-create')
        data = {
            "model": "lorenz",
            "params": {"sigma": 10.0, "beta": 2.667, "initial": [1, 1, 1]}
        }
        api_client_unit.force_authenticate(user=mock_user)

        response = api_client_unit.post(url, data, format='json')

        assert response.status_code == status.HTTP_400_BAD_REQUEST, "Має бути помилка 400 BAD REQUEST"
        assert "Lorenz model requires" in str(response.data)