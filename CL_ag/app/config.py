import os

AUTH_MS_URL = os.getenv("AUTH_MS_URL", "http://cl-auth-ms:8080")
RESIDENCE_MS_URL = os.getenv("RESIDENCE_MS_URL", "http://CL_residence_ms:3001")
MESSAGING_MS_URL = os.getenv("MESSAGING_MS_URL", "http://CL_messaging-ms:9000")
STATISTICS_MS_URL = os.getenv("STATISTICS_MS_URL", "http://CL_statistics_ms:8001")