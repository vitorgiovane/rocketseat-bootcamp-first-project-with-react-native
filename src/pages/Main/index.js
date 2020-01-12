import React, { Component } from 'react'
import { Container, Form, Input, SubmitButton } from './styles'
import api from '../../services/api'
import { Keyboard } from 'react-native'

import Icon from 'react-native-vector-icons/MaterialIcons'

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
          />
          <SubmitButton onPress={this.handleAddNewUser}>
            <Icon name="add" size={20} color="#fff" />
          </SubmitButton>
        </Form>
      </Container>
    )
  }
}

Main.navigationOptions = {
  title: 'Users'
}
