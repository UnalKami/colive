import os

AUTH_MS_URL = os.getenv("AUTH_MS_URL", "https://CL_LoadBalance:8080")
RESIDENCE_MS_URL = os.getenv("RESIDENCE_MS_URL", "https://CL_LoadBalance:3001")
MESSAGING_MS_URL = os.getenv("MESSAGING_MS_URL", "https://CL_LoadBalance:7000")
STATISTICS_MS_URL = os.getenv("STATISTICS_MS_URL", "https://CL_LoadBalance:8001")