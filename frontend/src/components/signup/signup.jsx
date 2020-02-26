
import React from 'react'

import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react';

import './signup.css';

const axios = require('axios');
const env = require('../../environment').environment;

export class SignupComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: "",
            email: "",
            password: "",
            passwordConfirmation: ""
        }
    }

    onNameChange = (event) => {
        this.setState({...this.state, name: event.target.value})
    }

    onEmailChange = (event) => {
        this.setState({...this.state, email: event.target.value})
    }

    onPasswordChange = (event) => {
        this.setState({...this.state, password: event.target.value})
    }

    onConfirmPasswordChange = (event) => {
        this.setState({...this.state, passwordConfirmation: event.target.value})
    }

    submit = () => {
        if (this.state.password === this.state.passwordConfirmation) {
            axios.post(env.BASE_URL + 'auth/signup', this.state)
            .then((response) => {
                let sessionId = response.data.sessionId
            })
            .catch((err) => {
                console.log(err)
            })
        } 
    }

    render() {
        return (
            <Grid textAlign='center' className="grid" verticalAlign='middle'>
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
}