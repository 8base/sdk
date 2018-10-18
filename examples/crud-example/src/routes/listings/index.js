import React from 'react';
import { Card, Heading, Table, Button, Dropdown, Icon, Menu, withModal, Paper, Link } from '@8base/boost';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { DateTime } from 'luxon';

import { ListingDeleteDialog } from './ListingDeleteDialog';
import { ListingCreateDialog } from './ListingCreateDialog';
import { ListingShareDialog } from './ListingShareDialog';

const LISTINGS_LIST_QUERY = gql`
  query ListingsList {
    listingsList {
      items {
        id
        createdAt
        updatedAt
        property {
          id
          title
        }
        broker {
          id
          user {
            firstName
            lastName 
          }
        }
        buyer {
          id
          user {
            firstName
            lastName 
          }
        }
        seller {
          id
          user {
            firstName
            lastName 
          }
        }
        documents {
          items {
            filename
            downloadUrl
          }
        }
        status
        closingDate
        price
      }
    }
  }
`;

let Listings = ({ openModal, closeModal }) => (
  <Query query={ LISTINGS_LIST_QUERY }>
    {
      ({ data, loading }) => (
        <Card.Plate padding="md" stretch>
          <Card.Header>
            <Heading type="h4" text="Listings" />
          </Card.Header>

          <ListingCreateDialog closeModal={ closeModal } />
          <ListingShareDialog closeModal={ closeModal } />
          <ListingDeleteDialog closeModal={ closeModal } />

          <Card.Body padding="none" stretch>
            <Table.Plate>
              <Table.Header columns="repeat(10, 1fr) 60px">
                <Table.HeaderCell>Property</Table.HeaderCell>
                <Table.HeaderCell>Broker</Table.HeaderCell>
                <Table.HeaderCell>Buyer</Table.HeaderCell>
                <Table.HeaderCell>Seller</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Closing Date</Table.HeaderCell>
                <Table.HeaderCell>Created At</Table.HeaderCell>
                <Table.HeaderCell>Updated At</Table.HeaderCell>
                <Table.HeaderCell>Documents</Table.HeaderCell>
                <Table.HeaderCell>Price</Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Header>

              <Table.Body loading={ loading } data={ loading ? [] : data.listingsList.items }>
                {
                  (listing) => (
                    <Table.BodyRow columns="repeat(10, 1fr) 60px" key={ listing.id }>
                      <Table.BodyCell>
                        { listing.property.title }
                      </Table.BodyCell>
                      <Table.BodyCell>
                        { listing.broker.user.firstName } { listing.broker.user.lastName }
                      </Table.BodyCell>
                      <Table.BodyCell>
                        { listing.buyer.user.firstName } { listing.buyer.user.lastName }
                      </Table.BodyCell>
                      <Table.BodyCell>
                        { listing.seller.user.firstName } { listing.seller.user.lastName }
                      </Table.BodyCell>
                      <Table.BodyCell>
                        { listing.status }
                      </Table.BodyCell>
                      <Table.BodyCell>
                        {
                          listing.closingDate
                            ?
                            DateTime.fromISO(listing.closingDate).toFormat('ff')
                            :
                            'none'
                        }
                      </Table.BodyCell>
                      <Table.BodyCell>
                        { DateTime.fromISO(listing.createdAt).toFormat('ff') }
                      </Table.BodyCell>
                      <Table.BodyCell>
                        { DateTime.fromISO(listing.updatedAt).toFormat('ff') }
                      </Table.BodyCell>
                      <Table.BodyCell>
                        <Dropdown.Plate defaultOpen={ false }>
                          <Dropdown.Head>
                            { listing.documents.items.length } documents
                          </Dropdown.Head>
                          <Dropdown.Body pin="right">
                            <Paper padding="sm">
                              {
                                listing.documents.items.map(({ filename, downloadUrl }) => <Link key={ downloadUrl } target="_blank" href={ downloadUrl } size="sm">{ filename }</Link>)
                              }
                            </Paper>
                          </Dropdown.Body>
                        </Dropdown.Plate>
                      </Table.BodyCell>
                      <Table.BodyCell>
                        { listing.price }
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
                                  <Menu.Item onClick={ () => { openModal('LISTING_UPDATE_DIALOG', { id: listing.id }); closeDropdown(); } }>Edit</Menu.Item>
                                  <Menu.Item onClick={ () => { openModal('LISTING_SHARE_DIALOG', { id: listing.id }); closeDropdown(); } }>Share</Menu.Item>
                                  <Menu.Item onClick={ () => { openModal('LISTING_DELETE_DIALOG', { id: listing.id }); closeDropdown(); } }>Delete</Menu.Item>
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
                <Button onClick={ () => openModal('LISTING_CREATE_DIALOG') }>Create Listing</Button>
              </Table.Footer>
            </Table.Plate>
          </Card.Body>
        </Card.Plate>
      )
    }
  </Query>
);

Listings = withModal(Listings);

export { Listings };
