import React from 'react';
import MessagesHeader from './MessagesHeader'
import MessageForm from './MessageForm'
import { Segment, Comment } from 'semantic-ui-react';
import firebase from '../../firebase';
import Message from './Message'

class Messages extends React.Component {
    state = {
        messagesRef: firebase.database().ref('messages'),
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        messages: [],
        messagesLoading: true,
        searchTerm: '',
        searchLoading: false,
        searchResults: []
    }

    componentDidMount() {
        const { channel, user } = this.state;
        if (channel && user) {
            this.addListners(channel.id);
        }
    }

    addListners = channelId => {
        this.addMessageListener(channelId)
    }

    addMessageListener = channelId => {
        let loadedMessages = [];

        this.state.messagesRef.child(channelId).on("child_added", snap => {
            loadedMessages.push(snap.val());
            this.setState({
                messages: loadedMessages,
                messagesLoading: false
            })
        })
    }

    handleSearchChange = event => {
        this.setState({
            searchTerm: event.target.value,
            searchLoading: true
        }, () => this.handleSearchMessages());
    }

    handleSearchMessages = () => {
        const channelMessages = [...this.state.messages];
        // Globally and case insensitively
        const regex = new RegExp(this.state.searchTerm, 'gi');
        const searchResults = channelMessages.reduce((acc, message) => {
            if ((message.content && message.content.match(regex))
                || message.user.name.match(regex)) {
                acc.push(message);
            }
            return acc;
        }, [])
        this.setState({ searchResults: searchResults })
        setTimeout(() => this.setState({ searchLoading: false }), 700)
    }

    componentWillUnmount() {
        const { channel, user } = this.state;
        if (channel && user) {
            this.removeListeners(channel.id);
        }
    }

    displayMessages = messages => (
        messages.length > 0 && messages.map(message => (
            <Message
                key={message.timestamp}
                message={message}
                user={this.state.user}
            />
        ))
    )

    removeListeners = channelId => {
        this.state.messagesRef.child(channelId).off();
    }

    render() {

        const { messages, channel, user, searchTerm, searchResults, searchLoading } = this.state;
        return (
            <React.Fragment>
                <MessagesHeader
                    channelName={channel && `@${channel.name}`}
                    handleSearchChange={this.handleSearchChange}
                    searchLoading={searchLoading}
                />
                <Segment>
                    <Comment.Group className="messages">
                        {searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}
                    </Comment.Group>
                </Segment>

                <MessageForm
                    currentChannel={channel}
                    currentUser={user}
                />
            </React.Fragment>
        )
    }
}

export default Messages;