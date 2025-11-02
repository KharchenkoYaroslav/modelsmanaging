from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from . import physics


class SimulationView(APIView):

    def post(self, request):
        data = request.data
        model = data.get("model", "").lower()
        steps = int(data.get("steps", 1000))
        dt = float(data.get("dt", 0.01))
        color = data.get("color", "#0000ff")
        params = data.get("params", {})

        try:
            # --------- Вибір моделі ---------
            if model == "lorenz":
                sigma = float(params.get("sigma", 10))
                rho = float(params.get("rho", 28))
                beta = float(params.get("beta", 8 / 3))
                x0, y0, z0 = params.get("initial", [1, 1, 1])
                result = physics.lorenz_attractor(
                    x0, y0, z0, sigma=sigma, rho=rho, beta=beta, dt=dt, steps=steps
                )

                if not result["stable"]:
                    return Response(
                        {"error": "Simulation diverged (unstable parameters)"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                x, y, z = zip(*result["points"])
                return Response({"model": model, "x": x, "y": y, "z": z, "color": color})

            elif model == "henon":
                a = float(params.get("a", 1.4))
                b = float(params.get("b", 0.3))
                x0, y0 = params.get("initial", [0.1, 0.3])
                result = physics.henon_map(x0, y0, a=a, b=b, steps=steps)

                if not result["stable"]:
                    return Response(
                        {"error": "Simulation diverged (unstable parameters)"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                x, y = zip(*result["points"])
                return Response({"model": model, "x": x, "y": y, "color": color})

            elif model == "thomas":
                b = float(params.get("b", 0.18))
                x0, y0, z0 = params.get("initial", [1, 1, 1])
                result = physics.thomas_attractor(x0, y0, z0, b=b, dt=dt, steps=steps)

                if not result["stable"]:
                    return Response(
                        {"error": "Simulation diverged (unstable parameters)"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                x, y, z = zip(*result["points"])
                return Response({"model": model, "x": x, "y": y, "z": z, "color": color})

            else:
                return Response(
                    {"error": f"Unknown model '{model}'"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        except Exception as e:
            return Response(
                {"error": f"Invalid input or computation error: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
