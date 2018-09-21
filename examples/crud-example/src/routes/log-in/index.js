import React from 'react';
import { compose } from 'recompose';
import { css } from 'emotion';
import { Form, Field } from '@8base/forms';
import { withLogIn } from '@8base/auth';
import { Grid, Button, InputField, Heading } from '@8base/boost';
import { withRouter } from 'react-router-dom';

const formClassName = css`
  width: 320px;
`;

let LogIn = ({ logIn, history: { push }}) => (
  <Form onSubmit={ async (data) => { await logIn(data); push('/dashboard'); } }>
    {
      ({ handleSubmit, invalid, submitting }) => (
        <form className={ formClassName } onSubmit={ handleSubmit }>
          <Grid.Layout gap="xl">
            <Grid.Box alignItems="center">
              <Heading type="h3">Log In</Heading>
            </Grid.Box>
            <Grid.Box>
              <Field name="email" type="text" placeholder="Email Address" component={ InputField } />
            </Grid.Box>
            <Grid.Box>
              <Field name="password" type="password" placeholder="Password" component={ InputField } />
            </Grid.Box>
            <Grid.Box justifyContent="center">
              <Button size="lg" color="red" type="submit" text="Log In" disabled={ invalid } loading={ submitting } />
            </Grid.Box>
          </Grid.Layout>
        </form>
      )
    }
  </Form>
);

LogIn = compose(
  withLogIn,
  withRouter,
)(LogIn);

export { LogIn };
