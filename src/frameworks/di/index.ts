import { RepositoryRegistry } from "./repository_registry";
import { UseCaseRegistry } from "./usecase_registry";
export class DependancyInjection {
  static registerAll(): void {
    RepositoryRegistry.registerRepositories();
    UseCaseRegistry.registerUseCases();
  }
}