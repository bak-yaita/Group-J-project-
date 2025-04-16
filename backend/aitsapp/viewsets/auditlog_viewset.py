from rest_framework import viewsets
from auditlog.models import LogEntry
from aitsapp.serializers.auditlog_serializers import AuditLogSerializers

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LogEntry.objects.all().order_by("-timestamp")
    serializer_class = AuditLogSerializers
