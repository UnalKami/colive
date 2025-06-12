from django.db import models

class Resultado(models.Model):
    nombre = models.CharField(max_length=100)
    puntuacion = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'resultados'