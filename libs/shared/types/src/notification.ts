export type NotificationType =
  | 'patient_assigned'
  | 'appointment_reminder'
  | 'critical_alert'
  | 'lab_result'
  | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  patientId?: string;
}
