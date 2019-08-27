import React from 'react';
import { AppProvider, gql } from '@8base/react-sdk';
import { Auth, AUTH_STRATEGIES } from '@8base/auth';
import { Query } from 'react-apollo';

// 8base api endpoint
const API_ENDPOINT_URI = 'https://api.8base.com/cjxotvdpv006501l68k94dz80';
const API_TOKEN = 'ae8256f9-32ca-4e94-91a5-4769c91629a5';

const DOG_BREEDS_LIST = gql`
  query DogBreedsList {
    dogBreedsList {
      items {
        id
        name
      }
    }
  }
`;

const authClient = Auth.createClient({
  strategy: AUTH_STRATEGIES.API_TOKEN,
  subscribable: true,
}, {
  apiToken: API_TOKEN,
});

const DogBreeds = ({ loading, data }) => {
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Dog breeds</h2>
      <ul>
        { data.dogBreedsList.items.map(
          ({ id, name }) => <li><p key={ id }>{ name }</p></li>
        ) }
      </ul>
    </div>
  );
};

const App = () => (
  <AppProvider uri={ API_ENDPOINT_URI } authClient={ authClient }>
    { ({ loading }) => {
      if (loading) {
        return <p>Loading...</p>;
      }

      return (
        <React.Fragment>
          <h1>With Api Token App</h1>
          <Query query={ DOG_BREEDS_LIST }>
            { ({ loading, data }) => <DogBreeds loading={ loading } data={ data } /> }
          </Query>
        </React.Fragment>
      );
    } }
  </AppProvider>
);

export { App };
