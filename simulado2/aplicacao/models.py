from django.db import models

# Create your models here.
# Criação das models para o banco de dados do projeto
PRIORIDADE_CHOICES = [
        ('baixa', 'baixa'),
        ('media', 'media'),
        ('alta', 'alta')
    ] 

STATUS_CHOICES = [
        ('a fazer', 'a fazer'),
        ('fazendo', 'fazendo'),
        ('pronto', 'pronto')
    ]

class Usuario (models.Model):
    nome = models.CharField(max_length=255)
    email = models.CharField(max_length=50)

    def __str__(self):
        return self.nome

class Tarefas(models.Model):
    
    descricao = models.TextField()
    nome_setor = models.CharField(max_length=100)
    prioridade = models.CharField(max_length=5, choices=PRIORIDADE_CHOICES)
    data_cadastro = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=10, choices= STATUS_CHOICES, default='a fazer')
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)

    def __str__(self):
        return f'O usuário {self.usuario} está responsável pela tarefa {self.descricao}'