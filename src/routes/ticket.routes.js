import { Router } from "express";
import {
  createTicket,
  getProjectTickets,
  updateTicket,
} from "../controllers/ticket.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

// Manage tickets under a project
router.route("/project/:projectId").post(createTicket).get(getProjectTickets);

// Update specific ticket
router.patch("/:ticketId", updateTicket);

export default router;
