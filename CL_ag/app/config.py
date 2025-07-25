import os

AUTH_MS_URL = os.getenv("AUTH_MS_URL", "http://cl-auth-lb:8080")
RESIDENCE_MS_URL = os.getenv("RESIDENCE_MS_URL", "http://cl-residence-ms:3001")
MESSAGING_MS_URL = os.getenv("MESSAGING_MS_URL", "http://cl-messaging-ms:7000")
STATISTICS_MS_URL = os.getenv("STATISTICS_MS_URL", "http://cl-stadistics-ms:8001")