import { useState } from "react";
import { Button } from "@/components/ui/button";

type Notification = {
  id: number;
  message: string;
  read: boolean;
};

type NotificationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const mockNotifications: Notification[] = [
  { id: 1, message: "Your report ID CR-2024-002 has been processed", read: false },
  { id: 2, message: "Your issue in report ID CR-2024-001 was resolved", read: false },
  { id: 3, message: "New maintenance alert issued", read: true },
];

const NotificationModal = ({ isOpen, onClose }: NotificationModalProps) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-14 right-12 w-96 bg-background border border-border shadow-lg rounded-md p-4 z-50">
      <h3 className="text-lg font-semibold text-foreground mb-3">Notifications</h3>

      {notifications.length === 0 && (
        <div className="text-center text-muted-foreground p-4">
          No notifications
        </div>
      )}

      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`flex items-center justify-between p-3 mb-2 rounded-md ${
            notif.read ? "bg-gray-600 text-white":"bg-gray-200 text-gray-600" 
          }`}
        >
          <span className="text-sm">{notif.message}</span>

          {!notif.read && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => markAsRead(notif.id)}
              className="text-xs"
            >
              Mark as read
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationModal;
