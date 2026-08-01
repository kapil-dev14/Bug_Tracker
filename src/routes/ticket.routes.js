import { Router } from "express";
import {
  createTicket,
  getProjectTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} from "../controllers/ticket.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

// Manage tickets under a project
router.route("/project/:projectId").post(createTicket).get(getProjectTickets);

// Single ticket operations
router
  .route("/:ticketId")
  .get(getTicketById)
  .patch(updateTicket)
  .delete(deleteTicket);

export default router;
