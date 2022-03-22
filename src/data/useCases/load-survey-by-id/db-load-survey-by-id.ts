import {
  ILoadSurveyById,
  ILoadSurveyByIdRepository,
  SurveyModel,
} from './db-load-survey-by-id-protocols';

export class DbLoadSurveyById implements ILoadSurveyById {
  constructor(
    private readonly loadSurveyByIdRepository: ILoadSurveyByIdRepository
  ) {}
  async loadById(id: string): Promise<SurveyModel> {
    const surveys = await this.loadSurveyByIdRepository.loadById(id);

    return surveys;
  }
}
