import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { setCurrentChannel } from '../../actions';
import firebase from '../../firebase';


class ContactPanel extends React.Component {
    state = {
        user: this.props.currentUser,
        users: [],
        activeChannel: '',
        usersRef: firebase.database().ref('users'),
        connectedRef: firebase.database().ref('.info/connected'),
        presenceRef: firebase.database().ref('presence')
    }

    componentDidMount() {
        if (this.state.user) {
            this.addListeners(this.state.user.uid)
        }
    }

    componentWillUnmount() {
        this.state.usersRef.off()
        this.state.connectedRef.off()
        this.state.presenceRef.off()
    }

    addStatusToUser = (userID, connected = true) => {
        const updatedUsers = this.state.users.reduce((acc, user) => {
            if (user.uid === userID) {
                user['status'] = `${connected ? 'online' : 'offline'}`
            }
            return acc.concat(user)
        }, [])

        this.setState({ users: updatedUsers })
    }


    addListeners = currentUserUID => {
        let loadedUsers = [];
        this.state.usersRef.on('child_added', snap => {
            if (currentUserUID !== snap.key) {
                let user = snap.val()
                user['uid'] = snap.key
                user['status'] = 'offline'
                loadedUsers.push(user);
                this.setState({ users: loadedUsers })
            }
        })

        this.state.connectedRef.on('value', snap => {
            if (snap.val() === true) {
                const ref = this.state.presenceRef.child(currentUserUID)
                ref.set(true)
                ref.onDisconnect().remove(err => {
                    if (err != null) {
                        console.error(err)
                    }
                })
            }
        })

        this.state.presenceRef.on('child_added', snap => {
            if (currentUserUID !== snap.key) {
                this.addStatusToUser(snap.key);
            }
        })

        this.state.presenceRef.on('child_removed', snap => {
            if (currentUserUID !== snap.key) {
                this.addStatusToUser(snap.key, false)
            }
        })
    }

    changeChannel = user => {
        const channelId = this.getChannelId(user.uid);
        const channelData = {
            id: channelId,
            name: user.name
        }
        this.props.setCurrentChannel(channelData);
        this.setState({ activeChannel: user.uid });
    }

    getChannelId = userId => {
        const currentUserId = this.state.user.uid;
        return userId < currentUserId ? `${userId}/${currentUserId}` : `${currentUserId}/${userId}`
    }


    render() {
        const { users, activeChannel } = this.state;
        return (
            <Menu.Menu className="menu">
                <Menu.Item>
                    <span><Icon name="mail" /> CONTACTS</span>{'    '}({users.length})
                </Menu.Item>
                {users.map(user => (
                    <Menu.Item
                        active={user.uid === activeChannel}
                        key={user.uid}
                        onClick={() => this.changeChannel(user)}
                        style={{ opacity: 0.7, forStyle: 'italic' }}
                    >
                        <Icon
                            name="circle"
                            color={user.status === 'online' ? 'green' : 'red'}
                        />
                        @ {user.name}
                    </Menu.Item>
                ))}
            </Menu.Menu>
        )
    }
}


export default connect(null, { setCurrentChannel })(ContactPanel);