import { Selector } from '@ngxs/store';
import { ProcedureState } from './procedure-state';
import { ProcedureDraft, ProcedureStateModel } from './procedure-model';

export class ProcedureSelectors {
  @Selector([ProcedureState])
  static drafts(state: ProcedureStateModel): ProcedureDraft[] {
    return state.drafts;
  }

  @Selector([ProcedureState])
  static saving(state: ProcedureStateModel): boolean {
    return state.saving;
  }

  @Selector([ProcedureState])
  static error(state: ProcedureStateModel): string | null {
    return state.error;
  }
}