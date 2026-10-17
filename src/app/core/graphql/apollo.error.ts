import { NzNotificationService } from 'ng-zorro-antd/notification';
import { onError } from '@apollo/client/link/error';
import { inject, Injectable } from '@angular/core';
import { ApolloLink } from '@apollo/client/core';
import { GraphQLFormattedError } from 'graphql';

@Injectable({
  providedIn: 'root',
})
export class ApolloError {
  private readonly toast = inject(NzNotificationService);

  createErrorLink(): ApolloLink {
    return onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach((graphQLError) => {
          this.toast.error(getErrorTitle(graphQLError.extensions), graphQLError.message);
        });
      } else if (networkError) {
        this.toast.error(networkError.name, networkError.message);
      }
    });
  }
}

const getErrorTitle = (extensions: GraphQLFormattedError['extensions']): string => {
  return (extensions?.['code'] as string) ?? 'Error';
};