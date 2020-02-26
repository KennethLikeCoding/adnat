import React from 'react'

import './login.css';

import { Link, Redirect } from 'react-router-dom';
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'

const axios = require('axios');
const env = require('../../environment').environment;

export class LoginComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: "",
            password: "",
            sessionId: ""
        }
    }

    onEmailChange = (event) => {
        this.setState({...this.state, email: event.target.value})
    }

    onPasswordChange = (event) => {
        this.setState({...this.state, password: event.target.value})
    }

    onSubmit = () => {
        axios.post(env.BASE_URL + 'auth/login', {
            email: this.state.email,
            password: this.state.password
        })
        .then((response) => {
            this.setState({...this.state, sessionId: response.data.sessionId});
        })
        .catch((err) => {
            console.log(err)
        })
    }

    render() {
        if (this.state.sessionId !== "") {
            return (
                <Redirect to={{ pathname: '/dashboard', state: { sessionId: this.state.sessionId } }}></Redirect>
            )
        }
        return (
            <Grid textAlign='center' className="grid" verticalAlign='middle'>
                <Grid.Column className="grid-column">
                    <Header as='h2' color='teal' textAlign='center'>
                        Log-in to your account
                    </Header>
                    <Form size='large'>
                        <Segment>
                            <Form.Input onChange={this.onEmailChange} fluid icon='user' iconPosition='left' placeholder='E-mail address' />
                            <Form.Input onChange={this.onPasswordChange} fluid icon='lock' iconPosition='left' placeholder='Password' type='password'/>
                            <Button onClick={this.onSubmit} color='teal' fluid size='large'>
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