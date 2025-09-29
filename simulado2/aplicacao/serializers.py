from rest_framework import serializers
from .models import Usuario, Tarefas

class UsuarioSerializer(serializers.ModelSerializer):
    
    class Meta: 
        model = Usuario
        fields = '__all__'

class TarefasSerializer(serializers.ModelSerializer):
    usuario_nome = serializers.CharField(source="usuario.first_name", read_only=True)
    class Meta: 
        model = Tarefas
        fields = '__all__'
