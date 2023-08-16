from django.db import models

class Place(models.Model):
    #id = models.PositiveIntegerField(primary_key=True, unique=True)
    name = models.CharField(max_length=64)
    description = models.TextField(blank=True)
    address = models.CharField(max_length=264)

    def __str__(self):
        return str(self.id)