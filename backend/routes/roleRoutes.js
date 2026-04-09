import express from "express";
import { getRoles, createRole, deleteRole } from "../controllers/roleController.js";

const router = express.Router();

router.route("/")
  .get(getRoles)
  .post(createRole);

router.route("/:title")
  .delete(deleteRole);

export default router;
