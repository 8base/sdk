import React from 'react';
import { Card, Heading, Table, Button, Dropdown, Icon, Menu, withModal } from '@8base/boost';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import { BrokerCreateDialog } from './BrokerCreateDialog';

const BROKERS_LIST_QUERY = gql`
  query BrokersList {
    brokersList {
      id
      user {
        email
        firstName
        lastName
      }
    }
  }
`;

let Brokers = ({ openModal, closeModal }) => (
  <Query query={ BROKERS_LIST_QUERY }>
    {
      ({ data, loading }) => (
        <Card.Plate padding="md" stretch>
          <Card.Header>
            <Heading type="h4" text="Brokers" />
          </Card.Header>

          <BrokerCreateDialog closeModal={ closeModal } />

          <Card.Body padding="none" stretch>
            <Table.Plate>
              <Table.Header columns="repeat(3, 1fr) 60px">
                <Table.HeaderCell>First Name</Table.HeaderCell>
                <Table.HeaderCell>Last Name</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Header>

              <Table.Body loading={ loading } data={ loading ? [] : data.brokersList }>
                {
                  (broker) => (
                    <Table.BodyRow columns="repeat(3, 1fr) 60px" key={ broker.id }>
                      <Table.BodyCell>
                        { broker.user.firstName }
                      </Table.BodyCell>
                      <Table.BodyCell>
                        { broker.user.lastName }
                      </Table.BodyCell>
                      <Table.BodyCell>
                        { broker.user.email }
                      </Table.BodyCell>
                      <Table.BodyCell>
                        <Dropdown.Plate defaultOpen={ false }>
                          <Dropdown.Head>
                            <Icon name="Dots" color="LIGHT_GRAY2" />
                          </Dropdown.Head>
                          <Dropdown.Body pin="right">
                            {
                              ({ closeDropdown }) => (
                                <Menu.Plate>
                                  <Menu.Item onClick={ () => { openModal('BROKER_DELETE_DIALOG', { id: broker.id }); closeDropdown(); } }>Delete</Menu.Item>
                                </Menu.Plate>
                              )
                            }
                          </Dropdown.Body>
                        </Dropdown.Plate>
                      </Table.BodyCell>
                    </Table.BodyRow>
                  )
                }
              </Table.Body>
              <Table.Footer justifyContent="center">
                <Button onClick={ () => openModal('BROKER_CREATE_DIALOG') }>Create Broker</Button>
              </Table.Footer>
            </Table.Plate>
          </Card.Body>
        </Card.Plate>
      )
    }
  </Query>
);

Brokers = withModal(Brokers);

export { Brokers };
