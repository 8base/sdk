import React from 'react';
import { Card, Heading, Table, Button, Dropdown, Icon, Menu, withModal } from '@8base/boost';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { DateTime } from 'luxon';

import { PropertyCreateDialog } from './PropertyCreateDialog';
import { PropertyDeleteDialog } from './PropertyDeleteDialog';

const PROPERTIES_LIST_QUERY = gql`
  query PropertiesList {
    propertiesList {
      id
      createdAt
      updatedAt
      pictures {
        url
      }
      bedrooms
      title
      description
      sqFootage
      bathrooms
      garage
      pool
    }
  }
`;

let Properties = ({ openModal, closeModal }) => (
  <Query query={ PROPERTIES_LIST_QUERY }>
    {
      ({ data, loading }) => (
        <Card.Plate padding="md" stretch>
          <Card.Header>
            <Heading type="h4" text="Properties" />
          </Card.Header>

          <PropertyCreateDialog closeModal={ closeModal } />
          <PropertyDeleteDialog closeModal={ closeModal } />

          <Card.Body padding="none" stretch>
            <Table.Plate>
              <Table.Header columns="repeat(10, 1fr) 60px">
                <Table.HeaderCell>Pictures</Table.HeaderCell>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Description</Table.HeaderCell>
                <Table.HeaderCell>Created At</Table.HeaderCell>
                <Table.HeaderCell>Updated At</Table.HeaderCell>
                <Table.HeaderCell>Bedrooms</Table.HeaderCell>
                <Table.HeaderCell>Sq Footage</Table.HeaderCell>
                <Table.HeaderCell>Bathrooms</Table.HeaderCell>
                <Table.HeaderCell>Garage</Table.HeaderCell>
                <Table.HeaderCell>Pool</Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Header>

              <Table.Body loading={ loading } data={ loading ? [] : data.propertiesList }>
                {
                  (property) => (
                    <Table.BodyRow columns="repeat(10, 1fr) 60px" key={ property.id }>
                      <Table.BodyCell>
                        { property.pictures.length > 0 && <img src={ property.pictures[0].url } alt="" style={{ width: '5rem', height: '5rem' }} /> }
                      </Table.BodyCell>
                      <Table.BodyCell>
                        { property.title }
                      </Table.BodyCell>
                      <Table.BodyCell>
                        { property.description }
                      </Table.BodyCell>
                      <Table.BodyCell>
                        { DateTime.fromISO(property.createdAt).toFormat('ff') }
                      </Table.BodyCell>
                      <Table.BodyCell>
                        { DateTime.fromISO(property.updatedAt).toFormat('ff') }
                      </Table.BodyCell>
                      <Table.BodyCell>
                        { property.bedrooms }
                      </Table.BodyCell>
                      <Table.BodyCell>
                        { property.sqFootage }
                      </Table.BodyCell>
                      <Table.BodyCell>
                        { property.bathrooms }
                      </Table.BodyCell>
                      <Table.BodyCell>
                        { `${property.garage}` }
                      </Table.BodyCell>
                      <Table.BodyCell>
                        { `${property.pool}` }
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
                                  <Menu.Item onClick={ () => { openModal('PROPERTY_UPDATE_DIALOG', { id: property.id }); closeDropdown(); } }>Edit</Menu.Item>
                                  <Menu.Item onClick={ () => { openModal('PROPERTY_DELETE_DIALOG', { id: property.id }); closeDropdown(); } }>Delete</Menu.Item>
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
                <Button onClick={ () => openModal('PROPERTY_CREATE_DIALOG') }>Create Property</Button>
              </Table.Footer>
            </Table.Plate>
          </Card.Body>
        </Card.Plate>
      )
    }
  </Query>
);

Properties = withModal(Properties);

export { Properties };
