import React from "react";
import firebase from "../../firebase";
import { Segment, Button, Input } from "semantic-ui-react";

class MessageForm extends React.Component {
    state = {
        messagesRef: firebase.database().ref('messages'),
        message: "",
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        loading: false,
        errors: [],
        modal: false
    };

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    createMessage = (fileUrl = null) => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            }
        };
        message["content"] = this.state.message;

        return message;
    };

    sendMessage = () => {
        const { message, channel, messagesRef } = this.state;

        if (message) {
            this.setState({ loading: true });
            messagesRef
                .child(channel.id)
                .push()
                .set(this.createMessage())
                .then(() => {
                    this.setState({ loading: false, message: "", errors: [] });
                })
                .catch(err => {
                    console.error(err);
                    this.setState({
                        loading: false,
                        errors: this.state.errors.concat(err)
                    });
                });
        } else {
            this.setState({
                errors: this.state.errors.concat({ message: "Add a message" })
            });
        }
    };

    getPath = () => {
        if (this.props.isPrivateChannel) {
            return `chat/private-${this.state.channel.id}`
        } else {
            return `chat/public`
        }
    }

    render() {
        const { errors, message, loading, channel } = this.state;

        return (
            <Segment className="message__form">
                <Input
                    fluid
                    name="message"
                    disabled={loading || !channel}
                    onChange={this.handleChange}
                    value={message}
                    style={{ marginBottom: "0.7em" }}
                    label={<Button icon={"add"} />}
                    labelPosition="left"
                    className={
                        errors.some(error => error.message.includes("message"))
                            ? "error"
                            : ""
                    }
                    placeholder="Write your message"
                />
                <Button.Group icon widths="2">
                    <Button
                        onClick={this.sendMessage}
                        disabled={loading || !channel}
                        color="orange"
                        content="Add Reply"
                        labelPosition="left"
                        icon="edit"
                    />
                </Button.Group>
            </Segment>
        );
    }
}

export default MessageForm;
