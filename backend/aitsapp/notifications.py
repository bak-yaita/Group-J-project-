from django.core.mail import send_mail
from django.conf import settings

def send_notification_email(subject, message, recipient_email):
    """
    Send an email notification to a specific recipient.

    Args:
        subject (str): Email subject
        message (str): Email body content
        recipient_email (str): Recipient's email address
    """
    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,  # From email
            [recipient_email],  # To email
            fail_silently=False,
        )
        print(f"Email notification sent to {recipient_email}")
    except Exception as e:
        print(f"Failed to send email notification: {e}")