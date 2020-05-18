import React from 'react';
import firebase from '../../firebase'
import { Link } from 'react-router-dom';
import md5 from 'md5';
import { Grid, Header, Icon, Form, Segment, Button, Message } from 'semantic-ui-react';

class Register extends React.Component {

    state = {
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        error: null,
        loading: false,
        usersRef: firebase.database().ref('users'),
    }

    handleFormChange = event => {
        this.setState({ error: null })
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const { username, email, password, error } = this.state;
        if (this.isFormValid() && !error) {
            this.setState({ loading: true })
            firebase.auth().createUserWithEmailAndPassword(email, password).then(createdUser => {
                console.log(createdUser);
                createdUser.user.updateProfile({
                    displayName: username,
                    photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
                })
                    .then(() => {
                        this.saveUserToDatabase(createdUser)
                            .then(() => {
                                console.log('user saved');
                            })
                            .catch(err => {
                                console.log(err);
                                this.setState({ error: err, loading: false });
                            })
                    })
                    .catch(err => {
                        console.log(err);
                        this.setState({ error: err, loading: false });
                    })
            })
                .catch(err => {
                    console.log(err);
                    this.setState({ error: err, loading: false });
                });
        }
    }

    saveUserToDatabase = createdUser => {
        return this.state.usersRef.child(createdUser.user.uid).set({
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL
        })
    }

    isFormValid = () => {
        let temp_error;
        if (this.isFormEmpty()) {
            temp_error = { message: 'Please fill in all fields' }
        } else if (!this.isPasswordValid()) {
            temp_error = { message: 'Password too short or not matched' }
        }
        if (temp_error) {
            this.setState({ error: temp_error })
            return false
        } else {
            return true
        }
    }

    isPasswordValid = () => {
        const { password, passwordConfirmation } = this.state;
        if (password.length < 6 || passwordConfirmation.length < 6 || password !== passwordConfirmation) {
            return false;
        } else {
            return true;
        }
    }

    isFormEmpty = () => {
        const { username, email, password, passwordConfirmation } = this.state;
        return !username.length || !email.length || !password.length || !passwordConfirmation.length;
    }


    render() {
        const { username, email, password, passwordConfirmation, error, loading } = this.state
        return (
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h1' icon color='teal' textAlign='center'>
                        <Icon name="puzzle piece" color='teal' />
                        Register for React Chat
                    </Header>
                    <Form size='large' onSubmit={this.handleSubmit}>
                        <Segment stacked>
                            <Form.Input
                                fluid
                                name="username"
                                icon='user'
                                iconPosition='left'
                                placeholder='Username'
                                type='text'
                                onChange={this.handleFormChange}
                                value={username}
                            />
                            <Form.Input
                                fluid
                                name="email"
                                icon="mail"
                                iconPosition='left'
                                placeholder='Email Address'
                                type='email'
                                onChange={this.handleFormChange}
                                value={email}
                            />
                            <Form.Input
                                fluid
                                name="password"
                                icon='lock'
                                iconPosition='left'
                                placeholder='Password'
                                type='password'
                                className={error && error.message.toLowerCase().includes("password") ? 'error' : ''}
                                onChange={this.handleFormChange}
                                value={password}
                            />
                            <Form.Input
                                fluid
                                name="passwordConfirmation"
                                icon='lock'
                                iconPosition='left'
                                placeholder='Password Confirmation'
                                type='password'
                                className={error && error.message.toLowerCase().includes("password") ? 'error' : ''}
                                onChange={this.handleFormChange}
                                value={passwordConfirmation}
                            />
                            <Button
                                disabled={loading}
                                className={loading ? 'loading' : ''}
                                color='teal'
                                fluid size='large'
                            >
                                Register
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
                        Already have an account? <Link to='/login'>Login</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Register;