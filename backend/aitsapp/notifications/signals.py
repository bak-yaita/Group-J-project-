from django.db.models.signals import post_save
from django.dispatch import receiver
from ..models import Issue, Notification
from .utils import send_notification_email
from django.contrib.auth import get_user_model

User = get_user_model()

@receiver(post_save, sender=Issue)
def comprehensive_notification_handler(sender, instance, created, **kwargs):
    """Send notifications when an issue is created or updated"""

    # Determine notification content based on status
    if created:
        status_message = "submitted"
    elif instance.status == 'ASSIGNED':
        status_message = "assigned"
    elif instance.status == 'IN_PROGRESS':
        status_message = "in progress"
    elif instance.status == 'RESOLVED':
        status_message = "resolved"
    else:
        status_message = "updated"

    subject = f"Issue {status_message}: {instance.issue_type}"

    base_message = f"Issue ID: {instance.id}\n"
    base_message += f"issue_type: {instance.issue_type}\n"
    base_message += f"Status: {instance.status}\n"
    base_message += f"Last Updated: {instance.updated_at}\n\n"

    # Student
    if instance.student and hasattr(instance.student, 'is_student') and instance.student.is_student:
        student_message = base_message + "Your issue has been received and is being processed."
        send_notification_email(instance.student.email, subject, student_message)
        Notification.objects.create(
            user=instance.student,
            message=f"Your issue '{instance.issue_type}' has been {status_message}."
        )

    # Lecturer
    if instance.assigned_to and hasattr(instance.assigned_to, 'is_lecturer') and instance.assigned_to.is_lecturer:
        lecturer_message = base_message + "You have been assigned to handle this issue."
        send_notification_email(instance.assigned_to.email, subject, lecturer_message)
        Notification.objects.create(
            user=instance.assigned_to,
            message=f"You have been assigned to issue '{instance.issue_type}'."
        )

    # Registrars
    registrars = User.objects.filter(role='registrar')
    for registrar in registrars:
        registrar_message = base_message + "This notification is for your information and oversight."
        send_notification_email(registrar.email, subject, registrar_message)
        Notification.objects.create(
            user=registrar,
            message=f"Issue '{instance.issue_type}' has been {status_message}."
        )
