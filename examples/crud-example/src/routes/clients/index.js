import React from 'react';
import { Card, Heading, Link, Table, Button, Dropdown, Icon, Menu, withModal } from '@8base/boost';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import * as R from 'ramda';

import { AsyncContent } from 'shared/components';
import { ClientCreateDialog } from './ClientCreateDialog';
import { ClientDeleteDialog } from './ClientDeleteDialog';
import { ClientUpdateDialog } from './ClientUpdateDialog';

const CLIENTS_LIST_QUERY = gql`
  query ClientsList {
    clientsList {
      id
      createdAt
      updatedAt
      firstName
      lastName
      email
    }
  }
`;

let Clients = ({ openModal, closeModal }) => (
  <Query query={ CLIENTS_LIST_QUERY }>
    {
      ({ data, loading }) => (
        <Card.Plate padding="md" stretch>
          <Card.Header>
            <Heading type="h4" text="Clients" />
          </Card.Header>

          <ClientCreateDialog closeModal={ closeModal } />
          <ClientDeleteDialog closeModal={ closeModal } />
          <ClientUpdateDialog closeModal={ closeModal } />

          <Card.Body padding="none" stretch>
            <Table.Plate>
              <Table.Header columns="repeat(6, 1fr)">
                <Table.HeaderCell>Id</Table.HeaderCell>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Created At</Table.HeaderCell>
                <Table.HeaderCell>Updated At</Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Header>

              <Table.Body>
                <AsyncContent loading={ loading } stretch>
                  {
                    React.Children.toArray(
                      R.pathOr([], ['clientsList'], data).map((client) => (
                        <Table.BodyRow columns="repeat(6, 1fr)" key={ client.id }>
                          <Table.BodyCell>
                            { client.id }
                          </Table.BodyCell>
                          <Table.BodyCell>
                            <Link to="" onClick={ () => openModal('CLIENT_UPDATE_DIALOG', { id: client.id }) }>{ `${client.firstName} ${client.lastName}` }</Link>
                          </Table.BodyCell>
                          <Table.BodyCell>
                            { client.email }
                          </Table.BodyCell>
                          <Table.BodyCell>
                            { client.createdAt }
                          </Table.BodyCell>
                          <Table.BodyCell>
                            { client.updatedAt }
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
                                      <Menu.Item onClick={ () => { openModal('CLIENT_DELETE_DIALOG', { id: client.id }); closeDropdown(); } }>Delete</Menu.Item>
                                    </Menu.Plate>
                                  )
                                }
                              </Dropdown.Body>
                            </Dropdown.Plate>
                          </Table.BodyCell>
                        </Table.BodyRow>
                      )),
                    )
                  }
                </AsyncContent>
              </Table.Body>
              <Table.Footer justifyContent="center">
                <Button onClick={ () => openModal('CLIENT_CREATE_DIALOG') }>Create Client</Button>
              </Table.Footer>
            </Table.Plate>
          </Card.Body>
        </Card.Plate>
      )
    }
  </Query>
);

Clients = withModal(Clients);

export { Clients };
