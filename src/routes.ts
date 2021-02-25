import { Router } from "express";
import { SendMailController } from "./controllers/SendMailController";
import { SurveysController } from "./controllers/SurveysController";
import { UserController } from "./controllers/UserController";

const router = Router();

const userController = new UserController();
const surveysController = new SurveysController();
const sendMailController = new SendMailController();

// Rota para gerenciamento de usuários
router.post("/users", userController.create);

// Rota para gerenciamento de pesquisas
router.post("/surveys", surveysController.create);
router.get("/surveys", surveysController.show);

// Rota para gerenciamento de emails/surveys_users
router.post("/sendMail", sendMailController.execute);

export { router };
