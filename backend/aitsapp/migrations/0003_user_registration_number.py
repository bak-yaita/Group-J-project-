# Generated by Django 5.1.5 on 2025-03-22 14:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('aitsapp', '0002_remove_issue_title_issue_category_issue_course_code_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='registration_number',
            field=models.CharField(blank=True, max_length=20, null=True, unique=True),
        ),
    ]
