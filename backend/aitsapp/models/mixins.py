#this file contains reusable Django model mixins, such as TimestampMixin, which adds
# automatic timestamp fields (created_at, updated_at) to models
# for tracking creation and modification times. 
from django.db import models
from django.utils import timezone

class TimestampMixin(models.Model):
    """
    adds created _at and updated_at fields to the models
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True

class SoftDeleteMixin(models.Model):
    """
    adds soft delete to models
    """
    is_deleted =models.boolean(default=False,db_index=True) #db_index is created for performance(softdelete).
    deleted_at = models.DateTimeField(null=True,blank=True)
    
    class Meta:
        abstract = True
    def soft_delete(self):
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()
    
    def restore(self):
        self.is_deleted = False
        self.deleted_at = None
        self.save()
    
    def delete(self, *args, **kwargs):
        """Overrides delete method to perform soft delete"""
        self.soft_delete()

    def hard_delete(self, *args, **kwargs):
        """Permanently deletes the object"""
        super().delete(*args, **kwargs)
