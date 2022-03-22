import { ILoadSurveyByIdRepository } from '@data/protocols/db/survey/load-survey-by-id-repository';
import { SurveyModel } from '@domain/models/survey';
import { ILoadSurveyById } from '@domain/useCases/load-survey-by-id';

export class DbLoadSurveyById implements ILoadSurveyById {
  constructor(
    private readonly loadSurveyByIdRepository: ILoadSurveyByIdRepository
  ) {}
  async loadById(id: string): Promise<SurveyModel> {
    const surveys = await this.loadSurveyByIdRepository.loadById(id);

    return surveys;
  }
}
