import pytest
from django.db import IntegrityError
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.exceptions import ValidationError
from simulations.models import Simulation

pytestmark = pytest.mark.django_db


class TestUserModelConstraints:
    def test_username_uniqueness_constraint(self):
        User.objects.create_user(username='unique_user', password='password')

        with pytest.raises(IntegrityError):
            User.objects.create_user(username='unique_user', password='password')

    def test_username_max_length_validation(self):
        long_username = 'a' * 151
        user = User(username=long_username)
        with pytest.raises(ValidationError):
            user.full_clean()

    def test_first_name_max_length_validation(self):
        long_name = 'a' * 151
        user = User(username='testuser', first_name=long_name)
        with pytest.raises(ValidationError):
            user.full_clean()

    def test_last_name_max_length_validation(self):
        long_name = 'a' * 151
        user = User(username='testuser', last_name=long_name)
        with pytest.raises(ValidationError):
            user.full_clean()

    def test_email_not_unique(self):
        User.objects.create_user(username='user1', email='common_email@example.com')
        
        try:
            User.objects.create_user(username='user2', email='common_email@example.com')
        except IntegrityError:
            pytest.fail("Email field should not be unique by default")

    def test_default_user_flags(self):
        user = User.objects.create_user(username='default_flags_user')
        assert user.is_active is True
        assert user.is_staff is False
        assert user.is_superuser is False

    def test_str_representation(self):
        user = User(username='str_user')
        assert str(user) == 'str_user'


class TestSimulationModelConstraints:
    def test_user_foreign_key_not_null_constraint(self):
        with pytest.raises(IntegrityError):
            Simulation.objects.create(
                user=None,
                model_type='test',
                input_params={},
                results={}
            )

    def test_user_cascade_delete(self, mock_user):
        Simulation.objects.create(
            user=mock_user,
            model_type='test',
            input_params={},
            results={}
        )

        assert Simulation.objects.count() == 1
        mock_user.delete()
        assert Simulation.objects.count() == 0

    def test_model_type_max_length_validation(self):
        long_model_type = 'a' * 41
        user = User.objects.create_user(username='test_user')
        simulation = Simulation(
            user=user,
            model_type=long_model_type,
            input_params={},
            results={}
        )

        with pytest.raises(ValidationError):
            simulation.full_clean()

    def test_created_at_auto_now_add(self, mock_user):
        simulation = Simulation.objects.create(
            user=mock_user,
            model_type='lorenz',
            input_params={},
            results={}
        )

        assert simulation.created_at is not None
        assert isinstance(simulation.created_at, timezone.datetime)
        assert (timezone.now() - simulation.created_at).total_seconds() < 1

    def test_is_stable_default_value(self, mock_user):
        simulation = Simulation.objects.create(
            user=mock_user,
            model_type='lorenz',
            input_params={},
            results={}
        )

        assert simulation.is_stable is True

    def test_json_fields_can_store_dict_and_list(self, mock_user):
        dict_data = {'a': 1, 'b': [2, 3]}
        list_data = [1, 'test', {'c': True}]

        simulation = Simulation.objects.create(
            user=mock_user,
            model_type='lorenz',
            input_params=dict_data,
            results=list_data,
        )

        retrieved = Simulation.objects.get(pk=simulation.pk)
        assert retrieved.input_params == dict_data
        assert retrieved.results == list_data

    def test_str_representation(self, mock_user):
        simulation = Simulation.objects.create(
            user=mock_user,
            model_type='lorenz',
            input_params={},
            results={}
        )

        expected_str = f"lorenz by {mock_user.username} at {simulation.created_at}"
        assert str(simulation) == expected_str

    def test_user_reverse_relationship_access(self, mock_user):
        Simulation.objects.create(
            user=mock_user,
            model_type='lorenz',
            input_params={},
            results={}
        )
        Simulation.objects.create(
            user=mock_user,
            model_type='henon',
            input_params={},
            results={}
        )

        assert mock_user.simulations.count() == 2
        assert mock_user.simulations.first().model_type == 'lorenz'

    def test_can_store_false_in_is_stable(self, mock_user):
        simulation = Simulation.objects.create(
            user=mock_user,
            model_type='lorenz',
            input_params={},
            results={},
            is_stable=False
        )

        retrieved = Simulation.objects.get(pk=simulation.pk)
        assert retrieved.is_stable is False

    def test_model_type_db_allows_arbitrary_string(self, mock_user):
        arbitrary_string = 'not_a_valid_choice'
        simulation = Simulation.objects.create(
            user=mock_user,
            model_type=arbitrary_string,
            input_params={},
            results={}
        )
        
        retrieved = Simulation.objects.get(pk=simulation.pk)
        assert retrieved.model_type == arbitrary_string