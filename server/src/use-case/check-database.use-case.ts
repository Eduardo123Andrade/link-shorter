import { CheckDatabaseRepository } from '../repository';

const check = async () => {
  return await CheckDatabaseRepository.checkDatabase();
};

export const CheckDatabaseUseCase = {
  check,
};
