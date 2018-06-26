// @flow

import * as R from 'ramda';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';


/**
 * Interface of the createApolloClient config
 */
interface CreateApolloClientOptions {
  links?: ApolloLink[],

  connectToDevTools?: boolean,
  defaultOptions?: Object,
  queryDeduplication?: *,
  ssrForceFetchDelay?: *,
  ssrMode?: *,
}

/**
 * Hight Order Function create apollo-client by the options.
 *
 * @param config Config for create apollo client.
 * @param config.uri Endpoint of the GraphQl server.
 * @param config.links Array of the apollo links.
 *
 * @param config.connectToDevTools [Apolloclient option.](https://www.apollographql.com/docs/react/api/apollo-client.html#ApolloClientOptions)
 * @param config.defaultOptions [Apolloclient option.](https://www.apollographql.com/docs/react/api/apollo-client.html#ApolloClientOptions)
 * @param config.queryDeduplication [Apolloclient option.](https://www.apollographql.com/docs/react/api/apollo-client.html#ApolloClientOptions)
 * @param config.ssrForceFetchDelay [Apolloclient option.](https://www.apollographql.com/docs/react/api/apollo-client.html#ApolloClientOptions)
 * @param config.ssrMode [Apolloclient option.](https://www.apollographql.com/docs/react/api/apollo-client.html#ApolloClientOptions)
 *
 * @param jsonSchema Object with information about [unions and interfaces.](https://www.apollographql.com/docs/react/recipes/fragment-matching.html)
 * @return Function to create apollo client by jsonSchema
 */
const createApolloClient =
  (config: CreateApolloClientOptions) => (jsonSchema?: Object) => {
    const {
      links = [],
      ...rest
    } = config;

    const cache = R.isEmpty(jsonSchema)
      ? new InMemoryCache()
      : new InMemoryCache({
        fragmentMatcher: new IntrospectionFragmentMatcher({ introspectionQueryResultData: jsonSchema }),
      });

    return new ApolloClient({
      ...rest,
      cache,
      link: ApolloLink.from(links),
    });
  };


export { createApolloClient };
