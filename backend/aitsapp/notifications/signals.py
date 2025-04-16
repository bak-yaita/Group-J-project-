from django.db.models.signals import post_save
from django.dispatch import receiver
from .utils import send_notification_email
from ..models.issues import Issue  

@receiver(post_save, sender=Issue)
def issue_notification(sender, instance, created, **kwargs):
    """Sends email notifications when an issue is created or updated."""
    if created:
        subject = f"New Issue Created: #{instance.id}"
        message = f"""
        A new issue has been logged in the AITS system.

        Issue Details:
        - Issue ID: {instance.id}
        - Title: {instance.title}
        - Description: {instance.description}
        - Status: {instance.status}

        Please log in to the system for more details.
        """
    else:
        subject = f"Issue #{instance.id} Updated"
        message = f"""
        An issue in the AITS system has been updated.

        Issue Details:
        - Issue ID: {instance.id}
        - Title: {instance.title}
        - New Status: {instance.status}

        Please log in to the system for more details.
        """

    if instance.assigned_to:
        send_notification_email(subject, message, instance.assigned_to.email)