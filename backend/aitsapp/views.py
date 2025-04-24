from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse

@ensure_csrf_cookie
def set_csrf_token(request):
    return JsonResponse({"message": "CSRF cookie set"})
