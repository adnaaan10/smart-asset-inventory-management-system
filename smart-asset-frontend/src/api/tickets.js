import apiClient from "./apiClient";

/* GET tickets (with pagination, search, ordering) */
export const getTickets = (params) => {
  return apiClient.get("tickets/", { params });
};

/* CREATE ticket (EMPLOYEE) */
export const createTicket = (data) => {
  return apiClient.post("tickets/", data);
};

/* ASSIGN technician (ADMIN) */
export const assignTechnician = (ticketId, technicianId) => {
  return apiClient.post(`tickets/${ticketId}/assign_technician/`, {
    technician: technicianId,
  });
};

/* UPDATE status (TECHNICIAN) */
export const updateTicketStatus = (ticketId, status) => {
  return apiClient.post(`tickets/${ticketId}/update_status/`, {
    status,
  });
};
