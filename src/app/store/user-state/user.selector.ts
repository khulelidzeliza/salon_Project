import { Selector } from '@ngxs/store';
import { IUser, IUserStore } from './user.model';
import { UserState } from './user.state';


export class UserSelectors {
  @Selector([UserState])
  static getUser(state: IUserStore): IUser | null {
    return state.user;
  }

  @Selector([UserState])
  static isLoading(state: IUserStore): boolean {
    return state.loading;
  }
  @Selector([UserState])
  static isAuthorized(state: IUserStore): boolean {
    return state.user !== null;
  }
  @Selector([UserState])
  static getUserId(state: IUserStore): number | null {
    return state.user ? state.user.id : null;
  }

}
