import apiClient from "./apiClient";

export const getTechnicianDashboard = () => {
  return apiClient.get("technician-dashboard/");
};

export const updateTicketStatus = (ticketId, status) => {
  return apiClient.post(`tickets/${ticketId}/update_status/`, {
    status,
  });
};
