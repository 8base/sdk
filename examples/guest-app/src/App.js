import React from 'react';
import { AppProvider, gql } from '@8base/react-sdk';
import { Query } from 'react-apollo';

// 8base api endpoint
const API_ENDPOINT_URI = 'https://api.8base.com/cjxotvdpv006501l68k94dz80';

// Guest can query specific tables if he is allowed 
const CAT_BREEDS_LIST_QUERY = gql`
  query CatBreedsList {
    catBreedsList {
      items {
        id
        name
      }
    }
  }
`;

const CatBreeds = ({ loading, data }) => {
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Cat breeds</h2>
      <ul>
        { data.catBreedsList.items.map(
          ({ id, name }) => <li><p key={ id }>{ name }</p></li>
        ) }
      </ul>
    </div>
  );
};

const App = () => (
  <AppProvider uri={ API_ENDPOINT_URI }>
    { ({ loading }) => {
      if (loading) {
        return <p>Loading...</p>;
      }

      return (
        <React.Fragment>
          <h1>Guest App</h1>
          <Query query={ CAT_BREEDS_LIST_QUERY }>
            { ({ loading, data }) => <CatBreeds loading={ loading } data={ data } /> }
          </Query>
        </React.Fragment>
      );
    } }
  </AppProvider>
);

export { App };
