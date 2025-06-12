from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import ResultadoSerializer
from .models import Resultado
from django.db import connections
from pymongo import MongoClient

class ResultadoList(APIView):
    def get(self, request):
        resultados_all = []

        # PostgreSQL
        with connections['default'].cursor() as cursor:
            cursor.execute("SELECT nombre, puntuacion FROM resultados")
            rows = cursor.fetchall()
            resultados_all.extend([{'nombre': r[0], 'puntuacion': r[1]} for r in rows])

        # MySQL
        with connections['mysql_db'].cursor() as cursor:
            cursor.execute("SELECT nombre, puntuacion FROM resultados")
            rows = cursor.fetchall()
            resultados_all.extend([{'nombre': r[0], 'puntuacion': r[1]} for r in rows])

        # MongoDB
        mongo_client = MongoClient('mongodb://localhost:27017')
        mongo_collection = mongo_client.mongo_db.resultados
        mongo_results = mongo_collection.find({}, {'_id': 0, 'nombre': 1, 'puntuacion': 1})
        resultados_all.extend(list(mongo_results))

        serializer = ResultadoSerializer(resultados_all, many=True)
        return Response(serializer.data)
