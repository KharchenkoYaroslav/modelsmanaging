from rest_framework import serializers
from .models import Simulation


class SimulationCreateSerializer(serializers.Serializer):
    model = serializers.ChoiceField(choices=Simulation.ModelTypes.choices)
    steps = serializers.IntegerField(default=1000, min_value=1)
    color = serializers.CharField(max_length=20, default="#0000ff")
    params = serializers.JSONField()

    def validate(self, data):
        model = data.get("model")
        params = data.get("params", {})

        if model == Simulation.ModelTypes.LORENZ:
            required_params = {"sigma", "rho", "beta", "initial"}
            if not required_params.issubset(params.keys()):
                raise serializers.ValidationError(f"Lorenz model requires: {', '.join(required_params)}")
            if not (isinstance(params["initial"], list) and len(params["initial"]) == 3):
                raise serializers.ValidationError("Initial conditions for Lorenz must be a list of 3 numbers")
            if 'dt' in params and (not isinstance(params.get('dt'), (int, float)) or params.get('dt') <= 0):
                raise serializers.ValidationError({"dt": "dt must be a positive number"})
        elif model == Simulation.ModelTypes.HENON:
            required_params = {"a", "b", "initial"}
            if not required_params.issubset(params.keys()):
                raise serializers.ValidationError(f"Henon model requires: {', '.join(required_params)}")
            if not (isinstance(params["initial"], list) and len(params["initial"]) == 2):
                raise serializers.ValidationError("Initial conditions for Henon must be a list of 2 numbers")
        elif model == Simulation.ModelTypes.THOMAS:
            required_params = {"b", "initial"}
            if not required_params.issubset(params.keys()):
                raise serializers.ValidationError(f"Thomas model requires: {', '.join(required_params)}")
            if not (isinstance(params["initial"], list) and len(params["initial"]) == 3):
                raise serializers.ValidationError("Initial conditions for Thomas must be a list of 3 numbers")
            if 'dt' in params and (not isinstance(params.get('dt'), (int, float)) or params.get('dt') <= 0):
                raise serializers.ValidationError({"dt": "dt must be a positive number"})

        return data


class SimulationHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Simulation
        fields = ["id", "model_type", "created_at", "is_stable"]


class SimulationDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Simulation
        exclude = ["user"]