import { Ticket } from "../models/ticket.model.js";
import { Project } from "../models/project.model.js";
import { ApiError } from "../utils/ApiError.js";

export const createTicketService = async ({
  title,
  description,
  priority,
  projectId,
  assignedTo,
  userId,
}) => {
  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  // Check if creator is a member of the project
  if (!project.members.includes(userId)) {
    throw new ApiError(
      403,
      "You must be a member of this project to create tickets"
    );
  }

  const ticket = await Ticket.create({
    title,
    description,
    priority: priority || "Medium",
    project: projectId,
    assignedTo: assignedTo || [],
    createdBy: userId,
  });

  return ticket;
};

export const getProjectTicketsService = async ({
  projectId,
  status,
  priority,
  page = 1,
  limit = 10,
}) => {
  const query = { project: projectId };

  if (status) query.status = status;
  if (priority) query.priority = priority;

  const skip = (page - 1) * limit;

  const tickets = await Ticket.find(query)
    .populate("assignedTo", "username email fullname")
    .populate("createdBy", "username email")
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const totalTickets = await Ticket.countDocuments(query);

  return {
    tickets,
    pagination: {
      total: totalTickets,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(totalTickets / limit),
    },
  };
};

export const updateTicketService = async ({ ticketId, updates, userId }) => {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) throw new ApiError(404, "Ticket not found");

  // Prevent unauthorized updates
  const updatedTicket = await Ticket.findByIdAndUpdate(
    ticketId,
    { $set: updates },
    { new: true, runValidators: true }
  )
    .populate("assignedTo", "username email")
    .populate("createdBy", "username email");

  return updatedTicket;
};
