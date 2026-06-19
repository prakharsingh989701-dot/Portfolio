import express from 'express';
import {homeController,ContactUserController} from '../controllers/homeController.js';
const router = express.Router();

//create a route for the home page
router.get('/', homeController);
router.post('/', ContactUserController);
export default router;
