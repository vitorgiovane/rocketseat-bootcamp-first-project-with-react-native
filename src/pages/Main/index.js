import React, { Component } from 'react'
import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText
} from './styles'

import { Keyboard } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

import api from '../../services/api'

export default class Main extends Component {
  state = {
    newUser: '',
    users: []
  }

  handleAddNewUser = async () => {
    const { users, newUser } = this.state
    const response = await api.get(`/users/${newUser}`)
    const { name, login, bio, avatar_url: avatar } = response.data

    const data = {
      name,
      login,
      bio,
      avatar
    }

    this.setState({
      users: [...users, data],
      newUser: ''
    })

    Keyboard.dismiss()
  }

  render() {
    const { users, newUser } = this.state
    return (
      <Container>
        <Form>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Add user"
            onChangeText={text => this.setState({ newUser: text })}
            returnKeyType="send"
            onSubmitEditing={this.handleAddNewUser}
            value={this.state.newUser}
          />
          <SubmitButton onPress={this.handleAddNewUser}>
            <Icon name="add" size={20} color="#fff" />
          </SubmitButton>
        </Form>
        <List
          data={users}
          keyExtractor={user => user.login}
          renderItem={({ item }) => (
            <User>
              <Avatar source={{ uri: item.avatar }} />
              <Name>{item.name}</Name>
              <Bio>{item.bio}</Bio>
              <ProfileButton onPress={() => {}}>
                <ProfileButtonText>Open profile</ProfileButtonText>
              </ProfileButton>
            </User>
          )}
        />
      </Container>
    )
  }
}

Main.navigationOptions = {
  title: 'Users'
}
