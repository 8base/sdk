import React from 'react';
import { Card, Heading, Link, Table, Button, Dropdown, Icon, Menu } from '@8base/boost';
import * as R from 'ramda';

import { AsyncContent } from 'shared/components';
import { ClientCreateDialogContainer } from '../../containers/ClientCreateDialog.container';
import { ClientUpdateDialogContainer } from '../../containers/ClientUpdateDialog.container';
import { ClientDeleteDialogContainer } from '../../containers/ClientDeleteDialog.container';

const Clients = ({ data, loading, openDialog }) => (
  <Card.Plate padding="md" stretch>
    <Card.Header>
      <Heading type="h4" text="Clients" />
    </Card.Header>

    <ClientCreateDialogContainer />
    <ClientUpdateDialogContainer />
    <ClientDeleteDialogContainer />

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
                      <Link to="" onClick={ () => openDialog('CLIENT_UPDATE_DIALOG', { id: client.id }) }>{ `${client.firstName} ${client.lastName}` }</Link>
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
                                <Menu.Item onClick={ () => { openDialog('CLIENT_DELETE_DIALOG', { id: client.id }); closeDropdown(); } }>Delete</Menu.Item>
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
          <Button onClick={ () => openDialog('CLIENT_CREATE_DIALOG') }>Create Client</Button>
        </Table.Footer>
      </Table.Plate>
    </Card.Body>
  </Card.Plate>
);

export { Clients };
