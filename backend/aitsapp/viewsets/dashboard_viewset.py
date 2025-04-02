from rest_framework import viewsets 
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from aitsapp.permissions import IsStudent, IsRegistrar, IsLecturer

class StudentViewset(viewsets.ViewSet):
    permission_classes= [IsAuthenticated,IsStudent]

    def list(self,request):
        username = request.user.username
        return Response({"message": f"welcome, {username}"})
    
class LecturerViewset(viewsets.ViewSet):
    permission_classes =[IsAuthenticated,IsLecturer]

    def list(self,request):
        username = request.user.username
        return Response({"message": f"Welcome, {username}"})
    
class RegistrarViewset(viewsets.ViewSet):
    permission_classes =[IsAuthenticated,IsRegistrar]

    def list(self,request):
        username = request.user.username
        return Response({"message": f"Welcome, {username}"})
    

