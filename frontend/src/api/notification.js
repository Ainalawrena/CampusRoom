import api from "./axios";

/*
|--------------------------------------------------------------------------
| Notifications
|--------------------------------------------------------------------------
*/

export const getNotifications = () =>
    api.get("/notifications");

export const readNotification = (id) =>
    api.patch(`/notifications/${id}/read`);

export const readAllNotifications = () =>
    api.patch("/notifications/read-all");

export const deleteNotification = (id) =>
    api.delete(`/notifications/${id}`);