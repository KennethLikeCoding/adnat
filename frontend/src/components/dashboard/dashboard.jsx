import React from 'react'
import './dashboard.css';

import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react';

const axios = require('axios')
const env = require('../../environment').environment;


export class DashboardComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sessionId: props.location.state.sessionId,
            username: null,
            userId: null,
            orgId: null,
            email: null,
            orgs: [],
            displayOrgs: true
        };
    }

    getHeaders() {
        return {headers: {'Authorization': this.state.sessionId, 'content-type': 'application/json'}};
    }

    componentDidMount() {
        if (this.state.sessionId) {
            let headers = this.getHeaders();
            axios.get(env.BASE_URL + 'users/me', headers).then(
                resp => {
                    this.setState({
                        ...this.state, 
                        username: resp.data.name,
                        userId: resp.data.id,
                        email: resp.data.email,
                        orgId: resp.data.organisationId
                    })
                    this.loadOrgs();
            })
        }
    }

    loadOrgs() {
        let headers = this.getHeaders();
        axios.get(env.BASE_URL + 'organisations', headers).then(
            resp => {
                this.setState({...this.state, orgs: resp.data})
        })
    }

    notInOrg() {
        if (!this.state.orgId) {
            return (
                <p>You aren't a member of any organisations. Join an existing one or create a new one.</p>
            )
        }
    }

    renderExistingOrgs() {
        if (this.state.orgs.length === 0) {
            return (
                <p>There is no organisation</p>
            )
        } else {
            return this.state.orgs.map(
                org => {
                    return <ul>{org.name}</ul>
                }
            )
        }
    }

    onNameChange = (event) => {
        // this.setState({...this.state, name: event.target.value})
    }

    onSalaryChange = (event) => {
        // this.setState({...this.state, email: event.target.value})
    }

    submit = () => {
       
    }

    renderCreateOrg() {
        return (
            <div>
                <Grid textAlign='center'>
                    <Grid.Column className="w--100">
                        <Form size='large'>
                            <Segment>
                                <Form.Input onChange={this.onNameChange} fluid icon='user' iconPosition='left' placeholder="Name e.g Bob's burger" />
                                <Form.Input onChange={this.onSalaryChange} fluid icon='dollar sign icon' iconPosition='left' placeholder='Hourly Rate' />
                                <Button color='teal' onClick={this.submit} fluid size='large'>Create and Join</Button>
                            </Segment>
                        </Form>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }

    renderOrgs() {
        if (this.state.displayOrgs) {
            return this.renderExistingOrgs();
        }
        return this.renderCreateOrg();
    }

    displayOrgsHandler = () => {
        this.setState({...this.state, displayOrgs: true});
        let element = document.getElementsByClassName('display-orgs')[0];
        if (!element.classList.contains('active')) {
            element.classList.add('active');
        }        
        document.getElementsByClassName('new-org')[0].classList.remove('active')
    }

    newOrgHandler = () => {
        this.setState({...this.state, displayOrgs: false});
        let element = document.getElementsByClassName('new-org')[0]
        if (!element.classList.contains('active')) {
            element.classList.add('active');
        }
        document.getElementsByClassName('display-orgs')[0].classList.remove('active')
    }

    render() {
        if (this.state.username) {
            return (
                <div className="ui container pt--2">
                    <h1 className="adnat-title">Adnat</h1>
                    <p>Logged in as {this.state.username}</p>
                    {this.notInOrg()}
                    <div className="ui two item menu">
                        <a onClick={this.displayOrgsHandler} className="item active display-orgs">All Organisations</a>
                        <a onClick={this.newOrgHandler} className="item new-org">New Organisation</a>
                    </div>
                    {this.renderOrgs()}
                </div>
            )
        } else {
            return (
                <div>Loading ...</div>
            )
        }

    }
}