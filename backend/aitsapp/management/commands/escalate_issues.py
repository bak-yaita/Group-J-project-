from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from aitsapp.models import Issue, Notification, User

class Command(BaseCommand):
    help= 'Escalates unsolved issues older than 3 days'

    def handle(self, *args,**kwargs):
        cutoff_date  = timezone.now() - timedelta(days=3)
        issues_to_escalate = Issue.objects.filter(status='Open', created_at_lte=cutoff_date)

        for issue in issues_to_escalate:
            department = issue.created_by.department
            hod = User.objects.filter(is_hod=True, department=department).first()

            if hod:
                issue.assigned_to = hod
                issue.save()

                Notification.objects.create(user=hod,message=f"Issue '{issue.title}' is still unsolved after 3 days of assignment to the lecturer.",)

                self.stdout.write(self.style.SUCCESS( f"Issue '{issue.title}' escalated to HoD."))

            else:
                self.stdout.write(self.style.WARNING(f"No HoD found for department '{department.name}'"))
