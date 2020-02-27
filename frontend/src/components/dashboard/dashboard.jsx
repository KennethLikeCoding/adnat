import React from 'react'
import './dashboard.css';

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
            orgId: null,
            email: null
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
            })
        }
    }

    notInOrg() {
        if (!this.state.orgId) {
            return (<NotEmployedComponent sessionId={this.state.sessionId} />)
        }
    }

    render() {
        if (this.state.username) {
            return (
                <div className="ui container pt--2">
                    <h1 className="adnat-title">Adnat</h1>
                    <p>Logged in as {this.state.username}</p>
                    {this.notInOrg()}
                </div>
            )
        }
        return (
            <div>Loading ...</div>
        )
    }
}