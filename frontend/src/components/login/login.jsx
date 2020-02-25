import React from 'react'
import './login.css';
import { Link } from 'react-router-dom';
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'

export class LoginComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <Grid textAlign='center' className="grid" verticalAlign='middle'>
                <Grid.Column className="grid-column">
                    <Header as='h2' color='teal' textAlign='center'>
                        Log-in to your account
                    </Header>
                    <Form size='large'>
                        <Segment>
                            <Form.Input fluid icon='user' iconPosition='left' placeholder='E-mail address' />
                            <Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Password'
                                type='password'
                            />

                            <Button color='teal' fluid size='large'>
                                Login
                            </Button>
                        </Segment>
                    </Form>
                    <Link to='/signup'>
                        <Message>
                            New to us? Sign Up
                        </Message>
                    </Link>
                    <Message>
                        Forgot your password?
                    </Message>
                </Grid.Column>
            </Grid>
        )
    }
}