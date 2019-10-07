import React, { Component } from 'react';
import api from './../../../../api/api';
import * as I from './../../../../api/interfaces';
import { Form, FormGroup, Col, Row, Label, CustomInput, Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap';
interface IMatch {
    teamLeft: {
        id: string,
        wins: number
    },
    teamRight: {
        id: string,
        wins: number
    },
    vetos: { teamId: string, mapName: string, side: 'CT' | 'T' }[]
}
export default class Match extends Component<any, { teams: I.Team[] }> {
    constructor(props: any) {
        super(props);
        this.state = {
            teams: []
        }
    }
    async componentDidMount() {
        const teams = await api.teams.get();
        this.setState({ teams })
    }
    render() {
        return (
            <Form>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <Label for="match_type">Match Type</Label>
                            <CustomInput
                                type="select"
                                id="match_type"
                                name="match_type"
                            >
                                <option value="bo1">BO1</option>
                                <option value="bo2">BO2</option>
                                <option value="bo3">BO3</option>
                                <option value="bo5">BO5</option>
                            </CustomInput>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <h4 className="text-center">Left team</h4>
                    <FormGroup>
                        <Label for="">Score</Label>
                        <CustomInput
                            type="select"
                            id="left_score"
                            name="left_score"
                        >
                            <option value="0">0</option>
                            {this.state.teams.map(team => <option key={team._id} value={team._id}>{team.name}</option>)}
                        </CustomInput>
                    </FormGroup>
                    <FormGroup>
                        <Label for="left_team">Set team</Label>
                        <CustomInput
                            type="select"
                            id="left_team"
                            name="left_team"
                        >
                        </CustomInput>
                    </FormGroup>
                </Row>
                <Row>
                    <Col md="5">
                        <Card>
                            <CardBody>
                                <CardTitle>Fnatic</CardTitle>
                                <CardSubtitle>Won 2 maps</CardSubtitle>
                                <CardText>LOGO</CardText>
                                <Button>SET</Button>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="2" className={'centered'}>
                        VS
                    </Col>
                    <Col md="5">
                        <Card>
                            <CardBody>
                                <CardTitle>Fnatic</CardTitle>
                                <CardSubtitle>Won 2 maps</CardSubtitle>
                                <CardText>LOGO</CardText>
                                <Button>SET</Button>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Form>
        )
    }
}
