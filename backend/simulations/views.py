from . import physics
from .models import Simulation
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import SimulationCreateSerializer, SimulationHistorySerializer, SimulationDetailSerializer


class SimulationCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SimulationCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data
        model = validated_data.get("model")
        steps = validated_data.get("steps")
        color = validated_data.get("color")
        params = validated_data.get("params", {})

        try:
            if model == Simulation.ModelTypes.LORENZ:
                sigma = float(params.get("sigma", 10))
                rho = float(params.get("rho", 28))
                beta = float(params.get("beta", 8 / 3))
                x0, y0, z0 = params.get("initial", [1, 1, 1])
                dt = float(params.get("dt", 0.01))

                result_data = physics.lorenz_attractor(x0, y0, z0, sigma=sigma, rho=rho, beta=beta, dt=dt, steps=steps)
                x, y, z = zip(*result_data["points"])
                results_json = {"x": x, "y": y, "z": z, "color": color}
            elif model == Simulation.ModelTypes.HENON:
                a = float(params.get("a", 1.4))
                b = float(params.get("b", 0.3))
                x0, y0 = params.get("initial", [0.1, 0.3])

                result_data = physics.henon_map(x0, y0, a=a, b=b, steps=steps)
                x, y = zip(*result_data["points"])
                results_json = {"x": x, "y": y, "color": color}
            elif model == Simulation.ModelTypes.THOMAS:
                b = float(params.get("b", 0.18))
                x0, y0, z0 = params.get("initial", [1, 1, 1])
                dt = float(params.get("dt", 0.01))
                
                result_data = physics.thomas_attractor(x0, y0, z0, b=b, dt=dt, steps=steps)
                x, y, z = zip(*result_data["points"])
                results_json = {"x": x, "y": y, "z": z, "color": color}

            simulation = Simulation.objects.create(
                user=request.user,
                model_type=model,
                input_params=validated_data,
                results=results_json,
                is_stable=result_data["stable"],
            )

            serializer = SimulationDetailSerializer(simulation)
            return Response(serializer.data, status=201)
        except Exception as e:
            return Response({"error": f"Invalid input or computation error: {str(e)}"}, status=400)


class SimulationHistoryView(ListAPIView):
    serializer_class = SimulationHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Simulation.objects.filter(user=self.request.user).order_by("-created_at")


class SimulationDetailView(RetrieveAPIView):
    serializer_class = SimulationDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Simulation.objects.filter(user=self.request.user)