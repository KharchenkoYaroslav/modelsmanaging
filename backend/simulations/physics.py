import math

# ------------------------------
# КОНСТАНТИ
# ------------------------------
MAX_VALUE = 1e3  # граничне значення координат для перевірки стабільності


# ------------------------------
# 1. Аттрактор Лоренца
# ------------------------------
def lorenz_attractor(x0, y0, z0, sigma=10.0, rho=28.0, beta=8/3, dt=0.01, steps=1000):
    """
    Модель Лоренца:
        dx/dt = σ(y - x)
        dy/dt = x(ρ - z) - y
        dz/dt = xy - βz

    Параметри:
        sigma, rho, beta — параметри системи
        dt — крок інтегрування
        steps — кількість кроків симуляції
    """
    x, y, z = x0, y0, z0
    result = []
    stable = True

    for step in range(steps):
        dx = sigma * (y - x)
        dy = x * (rho - z) - y
        dz = x * y - beta * z

        x += dx * dt
        y += dy * dt
        z += dz * dt

        # --- Перевірка стабільності ---
        if any(abs(v) > MAX_VALUE or math.isnan(v) for v in (x, y, z)):
            print(f"[!] Warning: Lorenz model diverged at step {step}")
            stable = False
            break

        result.append((x, y, z))

    return {
        "stable": stable,
        "points": result
    }


# ------------------------------
# 2. Мапа Хенона
# ------------------------------
def henon_map(x0, y0, a=1.4, b=0.3, steps=1000):
    """
    Модель Хенона:
        x_{n+1} = 1 - a * x_n^2 + y_n
        y_{n+1} = b * x_n
    """
    x, y = x0, y0
    result = []
    stable = True

    for step in range(steps):
        x_next = 1 - a * x * x + y
        y_next = b * x

        if any(abs(v) > MAX_VALUE or math.isnan(v) for v in (x_next, y_next)):
            print(f"[!] Warning: Henon map diverged at step {step}")
            stable = False
            break

        x, y = x_next, y_next
        result.append((x, y))

    return {
        "stable": stable,
        "points": result
    }


# ------------------------------
# 3. Аттрактор Томаса
# ------------------------------
def thomas_attractor(x0, y0, z0, b=0.18, dt=0.01, steps=1000):
    """
    Модель Томаса:
        dx/dt = -b * x + sin(y)
        dy/dt = -b * y + sin(z)
        dz/dt = -b * z + sin(x)
    """
    x, y, z = x0, y0, z0
    result = []
    stable = True

    for step in range(steps):
        dx = -b * x + math.sin(y)
        dy = -b * y + math.sin(z)
        dz = -b * z + math.sin(x)

        x += dx * dt
        y += dy * dt
        z += dz * dt

        if any(abs(v) > MAX_VALUE or math.isnan(v) for v in (x, y, z)):
            print(f"[!] Warning: Thomas model diverged at step {step}")
            stable = False
            break

        result.append((x, y, z))

    return {
        "stable": stable,
        "points": result
    }
