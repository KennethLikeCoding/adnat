import React from 'react'
import './dashboard.css';

import { EmployedComponent } from './employed/employed';
import { NotEmployedComponent } from './not-employed/not-employed';

const axios = require('axios')
const env = require('../../environment').environment;


export class DashboardComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sessionId: props.location.state.sessionId,
            username: null,
            userId: null,
            email: null,
            orgId: null,
            orgName: null,
            rate: null
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
                    })
                    let orgId = resp.data.organisationId
                    if (orgId) {
                        axios.get(env.BASE_URL + 'organisations/?org_id='+orgId, headers).then(
                            resp => {
                                let org = resp.data[0];
                                this.setState({...this.state, orgId: org.id, orgName: org.name, rate: org.hourlyRate});
                            }
                        )
                    }
            })
        }
    }

    renderMainContent() {
        if (!this.state.orgId) {
            return (<NotEmployedComponent sessionId={this.state.sessionId} onOrgChange={this.handleOrgChange} />)
        }
        let org = {id: this.state.orgId, name: this.state.orgName, rate: this.state.rate};
        return (<EmployedComponent sessionId={this.state.sessionId} org={org} onOrgChange={this.handleOrgChange}/>)
    }

    handleOrgChange = (org) => {
        if (org) {
            this.setState({...this.state, orgId: org.id, orgName: org.name, rate: org.hourlyRate});
        } else {
            this.setState({...this.state, orgId: null, orgName: null, rate: null});
        }        
    }

    handleLogout = () => {
        axios.delete(env.BASE_URL + 'auth/logout', this.getHeaders()).then(
            resp => {
                this.props.history.push('/');
            }
        )
    }

    render() {
        if (this.state.username) {
            return (
                <div className="ui container pt--2">
                    <h1 className="adnat-title">Adnat</h1>
                    <p>
                        Logged in as {this.state.username}
                        <span className="ml--5"><button onClick={this.handleLogout} className="ui grey basic mini button">Logout</button></span>
                    </p>
                    {this.renderMainContent()}
                </div>
            )
        }
        return (
            <div>Loading ...</div>
        )
    }
}