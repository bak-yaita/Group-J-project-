from rest_framework import viewsets
from auditlog.models import LogEntry
from ..serializers.auditlog_serializers import AuditLogSerializer

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LogEntry.objects.all().order_by("-timestamp")
    serializer_class = AuditLogSerializer
