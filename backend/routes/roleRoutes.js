import express from "express";
import { getRoles, createRole, deleteRole, deleteAllRoles } from "../controllers/roleController.js";

const router = express.Router();

router.route("/")
  .get(getRoles)
  .post(createRole)
  .delete(deleteAllRoles); // Add bulk delete

router.route("/:title")
  .delete(deleteRole);

export default router;
