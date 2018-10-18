import React from 'react';
import { Card, Heading, Table, Button, Dropdown, Icon, Menu, withModal } from '@8base/boost';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import { CustomerCreateDialog } from './CustomerCreateDialog';

const CUSTOMERS_LIST_QUERY = gql`
  query CustomersList {
    customersList {
      items {
        id
        user {
          email
          firstName
          lastName
        }
      }
    }
  }
`;

let Customers = ({ openModal, closeModal }) => (
  <Query query={ CUSTOMERS_LIST_QUERY }>
    {
      ({ data, loading }) => (
        <Card.Plate padding="md" stretch>
          <Card.Header>
            <Heading type="h4" text="Customers" />
          </Card.Header>

          <CustomerCreateDialog closeModal={ closeModal } />

          <Card.Body padding="none" stretch>
            <Table.Plate>
              <Table.Header columns="repeat(3, 1fr) 60px">
                <Table.HeaderCell>First Name</Table.HeaderCell>
                <Table.HeaderCell>Last Name</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Header>

              <Table.Body loading={ loading } data={ loading ? [] : data.customersList.items }>
                {
                  (customer) => (
                    <Table.BodyRow columns="repeat(3, 1fr) 60px" key={ customer.id }>
                      <Table.BodyCell>
                        { customer.user.firstName }
                      </Table.BodyCell>
                      <Table.BodyCell>
                        { customer.user.lastName }
                      </Table.BodyCell>
                      <Table.BodyCell>
                        { customer.user.email }
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
                                  <Menu.Item onClick={ () => { openModal('CUSTOMER_DELETE_DIALOG', { id: customer.id }); closeDropdown(); } }>Delete</Menu.Item>
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
                <Button onClick={ () => openModal('CUSTOMER_CREATE_DIALOG') }>Create Customer</Button>
              </Table.Footer>
            </Table.Plate>
          </Card.Body>
        </Card.Plate>
      )
    }
  </Query>
);

Customers = withModal(Customers);

export { Customers };
