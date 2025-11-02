from django.contrib.auth.models import User
from django.db import models


class Simulation(models.Model):
    class ModelTypes(models.TextChoices):
        LORENZ = "lorenz", ("Lorenz Attractor")
        HENON = "henon", ("Henon Map")
        THOMAS = "thomas", ("Thomas Attractor")

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="simulations")
    model_type = models.CharField(max_length=40, choices=ModelTypes.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    input_params = models.JSONField()
    results = models.JSONField()
    is_stable = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.model_type} by {self.user.username} at {self.created_at}"