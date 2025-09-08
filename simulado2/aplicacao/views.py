from django.shortcuts import render
from .models import Usuario, Tarefas
from .serializers import UsuarioSerializer, TarefasSerializer
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
# Create your views here.

class UsuarioListCreate(ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class TarefasListCreate(ListCreateAPIView):
    queryset = Tarefas.objects.all()
    serializer_class = TarefasSerializer

class TarefasRetrieveUpdtaeDestroy(RetrieveUpdateDestroyAPIView):
    queryset = Tarefas.objects.all()
    serializer_class = TarefasSerializer
    lookup_field = 'pk'
