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
            sessionId: "",
            error: false,
            incomplete: false
        }
    }

    onEmailChange = (event) => {
        this.setState({email: event.target.value, error: false, incomplete: false});
    }

    onPasswordChange = (event) => {
        this.setState({password: event.target.value, error: false, incomplete: false});
    }

    onSubmit = () => {
        if (this.state.email === "" || this.state.password === "") {
            this.setState({incomplete: true});
            return;
        }
        axios.post(env.BASE_URL + 'auth/login', {
            email: this.state.email,
            password: this.state.password
        })
        .then((response) => {
            this.setState({sessionId: response.data.sessionId});
        })
        .catch((err) => {
            this.setState({error: true});
        })
    }

    renderLoginForm() {
        return (
            <Grid textAlign='center' className="grid">
                <Grid.Column>
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

    render() {
        if (this.state.sessionId !== "") {
            return (
                <Redirect to={{ pathname: '/dashboard', state: { sessionId: this.state.sessionId } }}></Redirect>
            )
        }
        return (
            <div className="login-container">
                {this.renderLoginForm()}
                {this.state.error && (
                    <div className="ui red message login-error">Incorrect username or password</div>
                )}
                {this.state.incomplete && (
                    <div className="ui red message login-error">Please fill out both email and password</div>
                )}
            </div>
        )
    }
}