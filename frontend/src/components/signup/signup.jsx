import React from 'react'
import './signup.css';
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react'

export class SignupComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
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
                            <Form.Input fluid icon='user' iconPosition='left' placeholder='Name' />
                            <Form.Input fluid icon='mail' iconPosition='left' placeholder='Email' />
                            <Form.Input fluid icon='lock' iconPosition='left' placeholder='Password (6 characters minimum)' type='password'/>
                            <Form.Input fluid icon='lock' iconPosition='left' placeholder='Password Confirm' type='password'/>
                            <Button color='teal' fluid size='large'>Submit</Button>
                        </Segment>
                    </Form>
                </Grid.Column>
            </Grid>
        )
    }
}