import React from 'react';
import { Header, Segment, Input } from 'semantic-ui-react'

class MessagesHeader extends React.Component {
    render() {
        const { channelName, handleSearchChange, searchLoading } = this.props;
        return (
            <Segment clearing>
                <Header fluid="true" as="h2" floated='left' style={{ marginBottom: 0 }}>
                    <span>
                        {channelName}
                    </span>
                </Header>
                {/* Channel Search Input */}
                <Header floated="right">
                    <Input
                        loading={searchLoading}
                        onChange={handleSearchChange}
                        size="mini"
                        icon="search"
                        name="searchTerm"
                        placeholder="Serch Messages" />
                </Header>
            </Segment>

        )
    }
}

export default MessagesHeader