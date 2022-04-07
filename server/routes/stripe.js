import express from "express";
const router = express.Router();


import {createConnectAccount} from "../controllers/stripe"

router.post("/create-connect-account", createConnectAccount );

module.exports = router