import React from 'react';
import firebase from '../../firebase'
import { Link } from 'react-router-dom';
import { Grid, Header, Icon, Form, Segment, Button, Message } from 'semantic-ui-react';


class Login extends React.Component {

    state = {
        email: '',
        password: '',
        error: null,
        loading: false,
        usersRef: firebase.database().ref('users'),
    }

    handleFormChange = event => {
        this.setState({ error: null })
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit = event => {
        event.preventDefault();
        if (this.isFormValid()) {
            this.setState({ loading: true })
            firebase
                .auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(signedInUser => {
                    console.log(signedInUser);
                })
                .catch(err => {
                    console.error(err)
                    this.setState(({
                        error: err,
                        loading: false
                    }));
                });
        }
    }

    isFormValid = () => this.state.email && this.state.password;

    render() {
        const { email, password, loading, error } = this.state;
        return (
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h1' icon color='orange' textAlign='center'>
                        <Icon name="code branch" color='orange' />
                        Login React Chat
                    </Header>
                    <Form size='large' onSubmit={this.handleSubmit}>
                        <Segment stacked>
                            <Form.Input
                                fluid
                                name="email"
                                icon="mail"
                                iconPosition='left'
                                placeholder='Email Address'
                                type='email'
                                onChange={this.handleFormChange}
                                className={error && error.message.toLowerCase().includes("email") ? 'error' : ''}
                                value={email}
                            />
                            <Form.Input
                                fluid
                                name="password"
                                icon='lock'
                                iconPosition='left'
                                placeholder='Password'
                                type='password'
                                onChange={this.handleFormChange}
                                className={error && error.message.toLowerCase().includes("password") ? 'error' : ''}
                                value={password}
                            />
                            <Button
                                disabled={loading}
                                className={loading ? 'loading' : ''}
                                color='orange'
                                fluid size='large'
                            >
                                Login
                            </Button>
                        </Segment>
                    </Form>
                    {error &&
                        <Message error>
                            <h3>Error</h3>
                            <p>{error.message}</p>
                        </Message>
                    }
                    <Message>
                        Don't have an account? <Link to='/register'>Register</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Login;