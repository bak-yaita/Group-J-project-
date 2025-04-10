from django.db.models.signals import post_save
from django.dispatch import receiver
from .notifications import send_notification_email
from .models import Issue, Notification 

@receiver(post_save, sender=Issue)
def comprehensive_notification_handler(sender, instance, created, **kwargs):
    """Send notifications when an issue is created or updated"""
    
    # Determine notification content based on status
    if created:
        status_message = "created"
    elif instance.status == 'ASSIGNED':
        status_message = "assigned"
    elif instance.status == 'IN_PROGRESS':
        status_message = "in progress"
    elif instance.status == 'RESOLVED':
        status_message = "resolved"
    else:
        status_message = "updated"
    
    subject = f"Issue {status_message}: {instance.title}"
    
    # Base message for all recipients
    base_message = f"Issue ID: {instance.id}\n"
    base_message += f"Title: {instance.title}\n"
    base_message += f"Status: {instance.status}\n"
    base_message += f"Last Updated: {instance.updated_at}\n\n"
    
    # Send to student who reported the issue
    if instance.reported_by and hasattr(instance.reported_by, 'is_student') and instance.reported_by.is_student:
        student_message = base_message
        student_message += "Your issue has been received and is being processed."
        
        # Send email notification
        send_notification_email(instance.reported_by.email, subject, student_message)
        
        # Create database notification
        Notification.objects.create(
            user=instance.reported_by,
            message=f"Your issue '{instance.title}' has been {status_message}."
        )
    
    # Send to assigned lecturer
    if instance.assigned_to and hasattr(instance.assigned_to, 'is_lecturer') and instance.assigned_to.is_lecturer:
        lecturer_message = base_message
        lecturer_message += f"You have been assigned to handle this issue. Please review and update accordingly."
        
        # Send email notification
        send_notification_email(instance.assigned_to.email, subject, lecturer_message)
        
        # Create database notification
        Notification.objects.create(
            user=instance.assigned_to,
            message=f"You have been assigned to issue '{instance.title}'."
        )
    
    # Send to academic registrar for oversight
    from django.contrib.auth import get_user_model
    User = get_user_model()
    registrars = User.objects.filter(is_registrar=True)
    
    for registrar in registrars:
        registrar_message = base_message
        registrar_message += f"This notification is for your information and oversight."
        
        # Send email notification
        send_notification_email(registrar.email, subject, registrar_message)
        
        # Create database notification
        Notification.objects.create(
            user=registrar,
            message=f"Issue '{instance.title}' has been {status_message}."
        )
