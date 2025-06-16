from django.urls import path
from .views import (
    ResultadoList, EstadisticasReservasMongo, EstadisticasAdministracionMongo,
    EstadisticasApartamentosPostgres
)

urlpatterns = [
    path('resultados/', ResultadoList.as_view()),
    path('estadisticas/reservas/', EstadisticasReservasMongo.as_view()),
    path('estadisticas/administracion/', EstadisticasAdministracionMongo.as_view()),
    path('estadisticas/apartamentos/', EstadisticasApartamentosPostgres.as_view()),  
]
