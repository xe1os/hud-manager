import React from 'react';
import { Button, Form, FormGroup, Input, Row, Col, FormText } from 'reactstrap';
import countries from './../../countries';
import api from './../../../../api/api';
import * as I from './../../../../api/interfaces';
import { IContextData } from './../../../../components/Context';
import DragFileInput from './../../../DragFileInput';
import isSvg from './../../../../isSvg';
const hashCode = (s: string) =>
	s
		.split('')
		.reduce((a, b) => {
			a = (a << 5) - a + b.charCodeAt(0);
			return a & a;
		}, 0)
		.toString();
const hash = () => hashCode(String(new Date().getTime()));
export default class Teams extends React.Component<
	{ cxt: IContextData },
	{ options: any[]; value: string; form: I.Team; search: string }
> {
	emptyTeam: I.Team;
	constructor(props: { cxt: IContextData }) {
		super(props);
		this.emptyTeam = {
			_id: 'empty',
			name: '',
			shortName: '',
			country: '',
			logo: ''
		};

		this.state = {
			options: countries,
			value: '',
			search: '',
			form: { ...this.emptyTeam }
		};
	}

	componentDidMount = async () => {
		//this.loadTeams();
	};

	loadTeams = async (id?: string) => {
		await this.props.cxt.reload();
		if (id) {
			this.loadTeam(id);
		}
	};

	loadTeam = async (id: string) => {
		const team = this.props.cxt.teams.filter(team => team._id === id)[0];
		if (team) this.setState({ form: { ...team } });
	};

	setTeam = (event: any) => {
		if (event.target.value === 'empty') {
			return this.setState({ form: { ...this.emptyTeam } });
		}
		this.loadTeam(event.target.value);
	};

	fileHandler = (files: FileList) => {
		if (!files || !files[0]) return;
		const file = files[0];
		const { form } = this.state;
		if (!file.type.startsWith('image')) {
			return;
		}
		const reader: any = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			form.logo = reader.result.replace(/^data:([a-z]+)\/(.+);base64,/, '');
			this.setState({ form });
		};
	};

	changeHandler = (event: any) => {
		const name: 'name' | 'shortName' | 'logo' | 'country' = event.target.name;
		const { form }: any = this.state;
		if (!event.target.files) {
			form[name] = event.target.value;
			return this.setState({ form });
		}

		return this.fileHandler(event.target.files);
	};
	searchHandler = (event: any) => {
		this.setState({ search: event.target.value });
	};

	save = async () => {
		const { form } = this.state;
		let response: any;
		if (form._id === 'empty') {
			response = await api.teams.add(form);
		} else {
			let logo = form.logo;
			if (logo && logo.includes('api/teams/logo')) {
				logo = undefined as any;
			}
			response = await api.teams.update(form._id, { ...form, logo });
		}
		if (response && response._id) {
			this.loadTeams(response._id);
		}
	};
	delete = async () => {
		if (this.state.form._id === 'empty') return;
		const response = await api.teams.delete(this.state.form._id);
		if (response) {
			await this.loadTeams();
			this.setState({ form: { ...this.emptyTeam } });
		}
	};

	filterTeams = (team: I.Team): boolean => {
		const str = this.state.search.toLowerCase();
		const country = countries.find(country => country.value === team.country);
		return (
			team._id.toLowerCase().includes(str) ||
			team.name.toLowerCase().includes(str) ||
			team.shortName.toLowerCase().includes(str) ||
			(country && (country.value.toLowerCase().includes(str) || country.label.toLowerCase().includes(str)))
		);
	};

	render() {
		const { form } = this.state;
		let logo = '';
		if (form.logo) {
			if (form.logo.includes('api/teams/logo')) {
				logo = `${form.logo}?hash=${hash()}`;
			} else {
				const encoding = isSvg(Buffer.from(form.logo, 'base64')) ? 'svg+xml' : 'png';
				logo = `data:image/${encoding};base64,${form.logo}`;
			}
		}
		return (
			<Form>
				<div className="tab-title-container">
					<div>Teams</div>
					<Input
						type="text"
						name="name"
						id="team_search"
						value={this.state.search}
						onChange={this.searchHandler}
						placeholder="Search..."
					/>
				</div>
				<div className="tab-content-container">
					<FormText color="muted">Team: {form._id || '--- NONE ---'}</FormText>
					<FormGroup>
						<Input
							type="select"
							name="teams"
							id="teams"
							onChange={this.setTeam}
							value={this.state.form._id}
						>
							<option value={'empty'}>New team</option>
							{this.props.cxt.teams
								.concat()
								.filter(this.filterTeams)
								.sort((a, b) => (a.name < b.name ? -1 : 1))
								.map(team => (
									<option key={team._id} value={team._id}>
										{team.name}
									</option>
								))}
						</Input>
					</FormGroup>
					<Row>
						<Col md="6">
							<FormGroup>
								<Input
									type="text"
									name="name"
									id="team_name"
									value={this.state.form.name}
									onChange={this.changeHandler}
									placeholder="Team Name"
								/>
							</FormGroup>
						</Col>
						<Col md="6">
							<FormGroup>
								<Input
									type="text"
									name="shortName"
									id="short_name"
									value={this.state.form.shortName || ''}
									onChange={this.changeHandler}
									placeholder="Short Name"
								/>
							</FormGroup>
						</Col>
					</Row>
					<Row>
						<Col>
							<FormGroup>
								{/*<CustomInput
                                    type="select"
                                    id="country"
                                    name="country"
                                    value={this.state.form.country}
                                    onChange={this.changeHandler}
                                    placeholder="Country"
                                >
                                    <option value=''>Country</option>
                                    {this.state.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                                </CustomInput>*/}
								<Input
									type="select"
									id="country"
									name="country"
									value={this.state.form.country}
									onChange={this.changeHandler}
								>
									<option value="">Country</option>
									{this.state.options.map(option => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</Input>
							</FormGroup>
						</Col>
					</Row>
					<Row>
						<Col md="12">
							<FormGroup>
								<DragFileInput
									image
									onChange={this.fileHandler}
									id="team_logo"
									label="UPLOAD LOGO"
									imgSrc={logo || undefined}
								/>
								<FormText color="muted">
									Logo to be used for the team, if possible in the given HUD
								</FormText>
								{/*<Input type="file" name="logo" id="team_logo" onChange={this.changeHandler} />
                            <FormText color="muted">
                                Logo to be used for team, if possible in the given hud
                            </FormText>*/}
							</FormGroup>
						</Col>
					</Row>
					<Row>
						<Col className="main-buttons-container">
							<Button color="secondary" onClick={this.delete} disabled={this.state.form._id === 'empty'}>
								Delete
							</Button>
							<Button color="primary" onClick={this.save}>
								{this.state.form._id === 'empty' ? '+Add team' : 'Save'}
							</Button>
						</Col>
					</Row>
				</div>
			</Form>
		);
	}
}
