import {
  IAddSurvey,
  AddSurveyModel,
  IAddSurveyRepository,
} from './db-add-survey-protocols';

export class DbAddSurvey implements IAddSurvey {
  constructor(private readonly addSurveyRepository: IAddSurveyRepository) {}
  async add(data: AddSurveyModel): Promise<void> {
    await this.addSurveyRepository.add(data);
  }
}
