import React from 'react';
import { Grid } from 'semantic-ui-react';
import './App.css';
import { connect } from 'react-redux';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages'

const App = ({ currentUser, currentChannel }) => (
  <Grid divided='vertically' className="app">
    <Grid.Row columns={2}>
      <Grid.Column width={5}>
        <SidePanel currentUser={currentUser} />
      </Grid.Column>
      <Grid.Column width={8}>
        <Messages
          key={currentChannel && currentChannel.id}
          currentChannel={currentChannel}
          currentUser={currentUser}
        />
      </Grid.Column>
    </Grid.Row>
  </Grid>
)

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel
})

export default connect(mapStateToProps)(App);
