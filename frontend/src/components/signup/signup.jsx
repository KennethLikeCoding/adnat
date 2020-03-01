
import React from 'react'

import { Redirect } from 'react-router-dom';
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react';

import './signup.css';

const axios = require('axios');
const env = require('../../environment').environment;

export class SignupComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // form fields
            name: "",
            email: "",
            password: "",
            passwordConfirmation: "",
                
            sessionId: "",
            // form validations
            mismatch: false,
            incomplete: false,
            shortPassword: false,
            error: false,
        }
    }

    onNameChange = (event) => {
        this.setState({name: event.target.value, incomplete: false, error: false})
    }

    onEmailChange = (event) => {
        this.setState({email: event.target.value, incomplete: false, error: false})
    }

    onPasswordChange = (event) => {
        this.setState({password: event.target.value, incomplete: false, error: false, mismatch: false, shortPassword: false})
    }

    onConfirmPasswordChange = (event) => {
        this.setState({passwordConfirmation: event.target.value, incomplete: false, error: false, mismatch: false})
    }

    submit = () => {
        if (this.state.name === "" || this.email === "" || this.password === "" || this.passwordConfirmation === "") {
            this.setState({incomplete: true});
            return;
        }
        if (this.state.password.length < 6) {
            this.setState({shortPassword: true});
            return;
        }
        if (this.state.password !== this.state.passwordConfirmation) {
            this.setState({mismatch: true});
            return;
        }
        const body = {
            name: this.state.name, 
            email: this.state.email, 
            password: this.state.passwordConfirmation, 
            passwordConfirmation: this.state.passwordConfirmation
        }

        axios.post(env.BASE_URL + 'auth/signup', body)
        .then((resp) => {
            this.setState({sessionId: resp.data.sessionId})
        })
        .catch((err) => {
            this.setState({error: true});
        })
    }

    renderSignupForm() {
        return (
            <Grid textAlign='center' className="grid">
                <Grid.Column className="grid-column">
                    <Header as='h2' color='teal' textAlign='center'>
                        Sign up
                    </Header>
                    <Form size='large'>
                        <Segment>
                            <Form.Input onChange={this.onNameChange} fluid icon='user' iconPosition='left' placeholder='Name' />
                            <Form.Input onChange={this.onEmailChange} fluid icon='mail' iconPosition='left' placeholder='Email' />
                            <Form.Input onChange={this.onPasswordChange} fluid icon='lock' iconPosition='left' placeholder='Password (6 characters minimum)' type='password'/>
                            <Form.Input onChange={this.onConfirmPasswordChange} fluid icon='lock' iconPosition='left' placeholder='Password Confirm' type='password'/>
                            <Button color='teal' onClick={this.submit} fluid size='large'>Submit</Button>
                        </Segment>
                    </Form>
                </Grid.Column>
            </Grid>
        )
    }

    renderErrorMsg() {
        if (this.state.mismatch) {
            return (<div className="ui red message login-error">Password don't match</div>)
        }
        if (this.state.incomplete) {
            return (<div className="ui red message login-error">Please complete the form</div>)
        }
        if (this.state.shortPassword) {
            return (<div className="ui red message login-error">Password must contain at least 6 characters</div>)
        }
        if (this.state.error) {
            return (<div className="ui red message login-error">Something's wrong. Please try again or contact support.</div>)
        }
    }

    render() {
        if (this.state.sessionId !== "") {
            return (
                <Redirect to={{ pathname: '/dashboard', state: { sessionId: this.state.sessionId } }}></Redirect>
            )
        }
        return (
            <div className="login-container">
                {this.renderSignupForm()}
                {this.renderErrorMsg()}
            </div>
        )
    }
}