from django.urls import path
from .views import ResultadoList

urlpatterns = [
    path('resultados/', ResultadoList.as_view()),
]
