import React from 'react';
import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react';
import firebase from '../../firebase';

class UserPanel extends React.Component {
    state = {
        user: this.props.currentUser
    }

    dropdownOptions = () => [
        {
            id: 0,
            key: "user",
            text: <span>Sineged in as <strong>{this.state.user.displayName}</strong></span>,
            disabled: true
        },
        {
            id: 1,
            key: "avatar",
            text: <span>Change Avatar</span>
        },
        {
            id: 2,
            key: "signout",
            text: <span>Sign Out</span>
        }
    ]

    handleDropdownChange = (event) => {
        if (event.target.id === '2') {
            this.handleSignout()
        }
    }

    handleSignout = () => {
        firebase
            .auth()
            .signOut()
            .then(() => console.log('signed out!'))
    }

    render() {
        const { user } = this.state;

        return (
            <Grid>
                <Grid.Column>
                    <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
                        <Header inverted floated='left' as="h2">
                            <Icon name="code" />
                            <Header.Content>React Chat</Header.Content>
                        </Header>
                        <Header style={{ padding: '0.25em' }} as="h4" inverted>
                            <Dropdown trigger={
                                <span>
                                    <Image src={user.photoURL} spaced="right" avatar />
                                    {user.displayName}
                                </span>
                            } options={this.dropdownOptions()}
                                onChange={this.handleDropdownChange} />
                        </Header>
                    </Grid.Row>
                </Grid.Column>
            </Grid>

        )
    }
}

export default UserPanel;