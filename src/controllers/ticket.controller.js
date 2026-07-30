import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  createTicketService,
  getProjectTicketsService,
  updateTicketService,
} from "../services/ticket.service.js";

export const createTicket = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { title, description, priority, assignedTo } = req.body;

  const ticket = await createTicketService({
    title,
    description,
    priority,
    projectId,
    assignedTo,
    userId: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, ticket, "Ticket created successfully"));
});

export const getProjectTickets = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { status, priority, page, limit } = req.query;

  const data = await getProjectTicketsService({
    projectId,
    status,
    priority,
    page,
    limit,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Tickets retrieved successfully"));
});

export const updateTicket = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;

  const updatedTicket = await updateTicketService({
    ticketId,
    updates: req.body,
    userId: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTicket, "Ticket updated successfully"));
});
