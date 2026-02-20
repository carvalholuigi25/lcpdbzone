import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id?: number | string;
  title?: string;
  message: string;
  classname?: string;
  idname?: string;
  delay?: number;
  type?: ToastType;
  dismissible?: boolean;
}

export interface Notification {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  timestamp: Date;
  read: boolean;
  dismissible: boolean;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: Toast[] = [];
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();
  private notificationIdCounter = 0;

  show(message: string, options: Partial<Toast> = {}) {
    const toast = { message, dismissible: true, ...options };
    this.toasts.push(toast);

    if (toast.delay) {
      setTimeout(() => this.remove(toast), toast.delay);
    }
  }

  showToast(message: string, type: ToastType = 'info', delay: number = 3000, title?: string) {
    const classMap = {
      success: 'alert-success',
      error: 'alert-danger',
      warning: 'alert-warning',
      info: 'alert-info'
    };

    this.show(message, {
      classname: classMap[type],
      type,
      delay,
      title,
      dismissible: true
    });

    // Also add to notifications
    this.addNotification(message, type, title);
  }

  success(message: string, title: string = 'Success', delay: number = 3000) {
    this.showToast(message, 'success', delay, title);
  }

  error(message: string, title: string = 'Error', delay: number = 5000) {
    this.showToast(message, 'error', delay, title);
  }

  warning(message: string, title: string = 'Warning', delay: number = 4000) {
    this.showToast(message, 'warning', delay, title);
  }

  info(message: string, title: string = 'Info', delay: number = 3000) {
    this.showToast(message, 'info', delay, title);
  }

  private addNotification(message: string, type: ToastType, title?: string) {
    const notification: Notification = {
      id: `notification-${++this.notificationIdCounter}`,
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
      dismissible: true
    };

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([notification, ...currentNotifications]);
  }

  getNotifications(): Observable<Notification[]> {
    return this.notifications$;
  }

  markAsRead(notificationId: string) {
    const notifications = this.notificationsSubject.value;
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notificationsSubject.next([...notifications]);
    }
  }

  markAllAsRead() {
    const notifications = this.notificationsSubject.value;
    notifications.forEach(n => n.read = true);
    this.notificationsSubject.next([...notifications]);
  }

  clearNotifications() {
    this.notificationsSubject.next([]);
  }

  removeNotification(notificationId: string) {
    const notifications = this.notificationsSubject.value.filter(n => n.id !== notificationId);
    this.notificationsSubject.next(notifications);
  }

  remove(toast: Toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  clear() {
    this.toasts = [];
  }
}
