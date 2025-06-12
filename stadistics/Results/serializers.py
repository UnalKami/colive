from rest_framework import serializers

class ResultadoSerializer(serializers.Serializer):
    nombre = serializers.CharField()
    puntuacion = serializers.IntegerField()
