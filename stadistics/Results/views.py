from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import ResultadoSerializer
from .models import Resultado
from django.db import connections
from pymongo import MongoClient
import os
from django.http import JsonResponse

mongo_host = os.getenv('MONGO_HOST', 'localhost')
mongo_port = os.getenv('MONGO_PORT', '27017')
mongo_db = os.getenv('MONGO_DB', 'mongo_db')

mongo_client = MongoClient(f'mongodb://{mongo_host}:{mongo_port}')
db = mongo_client[mongo_db]

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
        mongo_collection = mongo_client.mongo_db.resultados
        mongo_results = mongo_collection.find({}, {'_id': 0, 'nombre': 1, 'puntuacion': 1})
        resultados_all.extend(list(mongo_results))

        serializer = ResultadoSerializer(resultados_all, many=True)
        return Response(serializer.data)

class EstadisticasReservasMongo(APIView):
    def get(self, request):
        db = mongo_client['residence_db']
        reservas = db['reserva']

        # Ejemplo: cantidad de reservas por amenidad
        pipeline = [
            {"$group": {"_id": "$amenidad", "total": {"$sum": 1}}},
            {"$sort": {"total": -1}}
        ]
        reservas_por_amenidad = list(reservas.aggregate(pipeline))

        # Ejemplo: reservas por estado
        pipeline_estado = [
            {"$group": {"_id": "$estado", "total": {"$sum": 1}}},
            {"$sort": {"total": -1}}
        ]
        reservas_por_estado = list(reservas.aggregate(pipeline_estado))

        return JsonResponse({
            "reservas_por_amenidad": reservas_por_amenidad,
            "reservas_por_estado": reservas_por_estado
        })


class EstadisticasAdministracionMongo(APIView):
    def get(self, request):
        db = mongo_client['residence_db']
        residences = db['residence']

        # Ejemplo: total de residencias en mora
        total_mora = residences.count_documents({"administracion.mora": {"$gt": 0}})

        # Ejemplo: promedio de valor mensual de administración
        pipeline = [
            {"$group": {"_id": None, "promedio": {"$avg": "$administracion.valor_mensual"}}}
        ]
        promedio_admin = list(residences.aggregate(pipeline))
        promedio = promedio_admin[0]['promedio'] if promedio_admin else 0

        # Ejemplo: residencias con pagos atrasados
        pipeline_atrasados = [
            {"$match": {"administracion.mora": {"$gt": 0}}},
            {"$project": {"code": 1, "administracion.mora": 1, "_id": 0}}
        ]
        atrasados = list(residences.aggregate(pipeline_atrasados))

        return JsonResponse({
            "total_residencias_en_mora": total_mora,
            "promedio_valor_mensual": promedio,
            "residencias_atrasadas": atrasados
        })

class EstadisticasApartamentosPostgres(APIView):
    def get(self, request):
        with connections['default'].cursor() as cursor:
            # Total de apartamentos
            cursor.execute("SELECT COUNT(*) FROM apartamento;")
            total_apartamentos = cursor.fetchone()[0]

            # Apartamentos por conjunto residencial
            cursor.execute("""
                SELECT cr.hash_conjunto_residencial, COUNT(a.id_apartamento)
                FROM conjunto_residencial cr
                JOIN apartamento a ON cr.id_conjunto_residencial = a.id_conjunto_residencial
                GROUP BY cr.hash_conjunto_residencial
                ORDER BY COUNT(a.id_apartamento) DESC;
            """)
            apartamentos_por_conjunto = [
                {"conjunto": row[0], "cantidad": row[1]} for row in cursor.fetchall()
            ]

            # Apartamentos con dueño asignado
            cursor.execute("SELECT COUNT(*) FROM apartamento WHERE duenio_id_usuario IS NOT NULL;")
            con_duenio = cursor.fetchone()[0]

            # Apartamentos sin dueño asignado
            cursor.execute("SELECT COUNT(*) FROM apartamento WHERE duenio_id_usuario IS NULL;")
            sin_duenio = cursor.fetchone()[0]

            # Apartamentos con más de un residente
            cursor.execute("""
                SELECT a.hash_apartamento, COUNT(r.usuario_id_usuario) as residentes
                FROM apartamento a
                JOIN residente r ON a.id_apartamento = r.apartamento_id_apartamento
                GROUP BY a.hash_apartamento
                HAVING COUNT(r.usuario_id_usuario) > 1
                ORDER BY residentes DESC;
            """)
            aptos_mas_de_un_residente = [
                {"apartamento": row[0], "residentes": row[1]} for row in cursor.fetchall()
            ]

        return Response({
            "total_apartamentos": total_apartamentos,
            "apartamentos_por_conjunto": apartamentos_por_conjunto,
            "apartamentos_con_duenio": con_duenio,
            "apartamentos_sin_duenio": sin_duenio,
            "apartamentos_mas_de_un_residente": aptos_mas_de_un_residente,
        })
