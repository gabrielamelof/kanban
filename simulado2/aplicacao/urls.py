from django.urls import path
from . views import UsuarioListCreate, TarefasListCreate, TarefasRetrieveUpdtaeDestroy

urlpatterns = [
    path('usuario/', UsuarioListCreate.as_view()),

    path('tarefas/',TarefasListCreate.as_view()),
    path('tarefas/<int:pk>/', TarefasRetrieveUpdtaeDestroy.as_view()),
]