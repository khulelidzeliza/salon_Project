import { ProcedureType } from '../../../generated/graphql';

export class AddProcedureDraft {
  static readonly type = '[Procedure] Add Draft';
}

export class RemoveProcedureDraft {
  static readonly type = '[Procedure] Remove Draft';
  constructor(public id: number) {}
}

export class SetProcedureType {
  static readonly type = '[Procedure] Set Type';
  constructor(public id: number, public procedureType: ProcedureType) {}
}

export class SetMasterDraft {
  static readonly type = '[Procedure] Set Master Draft';
  constructor(public id: number, public value: string) {}
}

export class AddMaster {
  static readonly type = '[Procedure] Add Master';
  constructor(public id: number) {}
}

export class RemoveMaster {
  static readonly type = '[Procedure] Remove Master';
  constructor(public id: number, public name: string) {}
}

export class SetFinishedWorks {
  static readonly type = '[Procedure] Set Finished Works';
  constructor(public id: number, public files: File[]) {}
}

export class ResetProcedureDrafts {
  static readonly type = '[Procedure] Reset Drafts';
}

export class SaveProcedures {
  static readonly type = '[Procedure] Save Procedures';
  constructor(public salonId: number) {}
}