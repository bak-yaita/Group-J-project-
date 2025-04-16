from django.db.models.signals import post_save
from django.dispatch import receiver
from .utils import send_notification_email
from django.contrib.auth import get_user_model
from models import Issue, Notification

User = get_user_model() 

@receiver(post_save, sender=Issue)
def comprehensive_notification_handler(sender, instance, created, **kwargs):
    """Send notifications when an issue is created or updated"""
    
    # Determine notification content based on status
    if submitted:
        status_message = "submitted"
    elif instance.status == 'assigned':
        status_message = "assigned"
    elif instance.status == 'in_progress':
        status_message = "in progress"
    elif instance.status == 'resolved':
        status_message = "resolved"
    else:
        status_message = "updated"
    
    subject = f"Issue {status_message}: {instance.ISSUE_TYPES}"
    
    # Base message for all recipients
    base_message = f"Issue ID: {instance.id}\n"
    base_message += f"ISSUE_TYPES: {instance.ISSUE_TYPES}\n"
    base_message += f"Status: {instance.status}\n"
    base_message += f"Last Updated: {instance.updated_at}\n\n"
    
    # Send to student who reported the issue
    if instance.student and hasattr(instance.student, 'is_student') and instance.student.is_student:
        student_message = base_message
        student_message += "Your issue has been received and is being processed."
        
        # Send email notification
        send_issue_notification(instance.student.email, subject, student_message)
        
        # Create database notification
        Notification.objects.create(
            user=instance.student,
            message=f"Your issue '{instance.ISSUE_TYPE}' has been {status_message}."
        )
    
    # Send to assigned lecturer
    if instance.assigned_to and hasattr(instance.assigned_to, 'is_lecturer') and instance.assigned_to.is_lecturer:
        lecturer_message = base_message
        lecturer_message += f"You have been assigned to handle this issue. Please review and update accordingly."
        
        # Send email notification
        send_issue_notification(instance.assigned_to.email, subject, lecturer_message)
        
        # Create database notification
        Notification.objects.create(
            user=instance.assigned_to,
            message=f"You have been assigned to issue '{instance.title}'."
        )
    
    # Send to academic registrar for oversight
    registrars = User.objects.filter(is_registrar=True)
    
    for registrar in registrars:
        registrar_message = base_message
        registrar_message += f"This notification is for your information and oversight."
        
        # Send email notification
        send_issue_notification(registrar.email, subject, registrar_message)
        
        # Create database notification
        Notification.objects.create(
            user=registrar,
            message=f"Issue '{instance.title}' has been {status_message}."
        )
