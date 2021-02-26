import { json, Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class NpsController {
  async execute(req: Request, res: Response) {
    const { survey_id } = req.params;

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveysUsers = await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull()),
    });

    if (surveysUsers.length <= 0) {
      throw new AppError("This survey does not exist or does not have any answers", 404);
    }

    const detractors = surveysUsers.filter((survey) => survey.value >= 0 && survey.value <= 6)
      .length;
    const promoters = surveysUsers.filter((survey) => survey.value >= 9 && survey.value <= 10)
      .length;
    const passives = surveysUsers.filter((survey) => survey.value >= 7 && survey.value <= 8).length;
    const totalAnswers = surveysUsers.length;

    const nps = Number((((promoters - detractors) / totalAnswers) * 100).toFixed(2));

    return res.json({
      nps,
      promoters,
      detractors,
      passives,
      totalAnswers,
      survey_id,
    });
  }
}

export { NpsController };
