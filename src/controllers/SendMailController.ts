import { Request, response, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";

class SendMailController {
  async execute(req: Request, res: Response) {
    const { email, survey_id } = req.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const user = await usersRepository.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: "User does not exist",
      });
    }

    const survey = await surveysRepository.findOne({
      id: survey_id,
    });

    if (!survey) {
      return res.status(400).json({
        error: "Survey does not exist",
      });
    }

    // Salvando informações na table surveys_users
    const surveyUser = surveysUsersRepository.create({
      user_id: user.id,
      survey_id,
    });

    await surveysUsersRepository.save(surveyUser);

    await SendMailService.execute(email, survey.title, survey.description);

    return res.status(201).json(surveyUser);
  }
}

export { SendMailController };
