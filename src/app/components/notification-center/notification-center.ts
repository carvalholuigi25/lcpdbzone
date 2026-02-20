import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Notification } from '@/app/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-center">
      <div class="notification-bell-icon" [attr.data-unread]="getUnreadCount(notifications$)">
        <i class="bi bi-bell"></i>
        <span class="notification-badge" *ngIf="(notifications$ | async) as notifications">
          {{ getUnreadCount(notifications) }}
        </span>
      </div>

      <div class="notification-dropdown">
        <ng-container *ngIf="notifications$ | async as notifications">
          <div *ngIf="notifications.length > 0" class="notifications-list">
            <div 
              *ngFor="let notification of notifications; trackBy: trackByNotificationId"
              [class]="'notification-item ' + notification.type"
              [class.read]="notification.read">
              <div class="notification-header">
                <span class="notification-title">
                  <i [class]="getIconClass(notification.type)"></i>
                  {{ notification.title || 'Notification' }}
                </span>
                <button 
                  *ngIf="notification.dismissible"
                  type="button"
                  class="btn-close"
                  (click)="removeNotification(notification.id)"
                  aria-label="Close">
                </button>
              </div>
              <p class="notification-message">{{ notification.message }}</p>
              <small class="notification-time">
                {{ notification.timestamp | date: 'short' }}
              </small>
            </div>
            <div class="notification-actions">
              <button 
                type="button"
                class="btn btn-sm btn-outline-secondary"
                (click)="markAllAsRead()">
                Mark all as read
              </button>
              <button 
                type="button"
                class="btn btn-sm btn-outline-danger"
                (click)="clearAll()">
                Clear all
              </button>
            </div>
          </div>
          <div *ngIf="notifications.length === 0" class="notifications-empty">
            <i class="bi bi-inbox"></i>
            <p>No notifications</p>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .notification-center {
      position: relative;
      display: inline-block;
    }

    .notification-bell-icon {
      position: relative;
      cursor: pointer;
      font-size: 1.5rem;
    }

    .notification-badge {
      position: absolute;
      top: -5px;
      right: -10px;
      background-color: #dc3545;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: bold;
    }

    .notification-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      min-width: 350px;
      max-height: 400px;
      overflow-y: auto;
      margin-top: 10px;
      z-index: 1000;
      display: none;
    }

    .notification-center:hover .notification-dropdown {
      display: block;
    }

    .notifications-list {
      padding: 0;
    }

    .notification-item {
      padding: 12px 16px;
      border-bottom: 1px solid #eee;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: #f8f9fa;
      }

      &.read {
        opacity: 0.7;
      }

      &.success .notification-header {
        color: #198754;
      }

      &.error .notification-header {
        color: #dc3545;
      }

      &.warning .notification-header {
        color: #ffc107;
      }

      &.info .notification-header {
        color: #0dcaf0;
      }
    }

    .notification-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .notification-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .notification-message {
      margin: 8px 0;
      font-size: 0.9rem;
      color: #666;
    }

    .notification-time {
      color: #999;
      font-size: 0.8rem;
    }

    .notification-actions {
      padding: 12px 16px;
      border-top: 1px solid #eee;
      display: flex;
      gap: 8px;
      justify-content: space-between;
    }

    .notifications-empty {
      padding: 40px 20px;
      text-align: center;
      color: #999;

      i {
        font-size: 2rem;
        display: block;
        margin-bottom: 10px;
      }
    }

    .btn-close {
      padding: 0;
      border: none;
      background: none;
      cursor: pointer;
      opacity: 0.6;

      &:hover {
        opacity: 1;
      }
    }
  `]
})
export class NotificationCenterComponent implements OnInit {
  notifications$!: Observable<Notification[]>;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.notifications$ = this.toastService.getNotifications();
  }

  getUnreadCount(notifications: Notification[] | Observable<Notification[]>): number {
    if (Array.isArray(notifications)) {
      return notifications.filter(n => !n.read).length;
    }
    return 0;
  }

  getIconClass(type: string): string {
    const iconMap: { [key: string]: string } = {
      success: 'bi bi-check-circle',
      error: 'bi bi-exclamation-circle',
      warning: 'bi bi-exclamation-triangle',
      info: 'bi bi-info-circle'
    };
    return iconMap[type] || 'bi bi-info-circle';
  }

  removeNotification(notificationId: string) {
    this.toastService.removeNotification(notificationId);
  }

  markAllAsRead() {
    this.toastService.markAllAsRead();
  }

  clearAll() {
    this.toastService.clearNotifications();
  }

  trackByNotificationId(index: number, notification: Notification): string {
    return notification.id;
  }
}
