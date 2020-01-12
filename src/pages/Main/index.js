import React, { Component } from 'react'
import { Keyboard, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/MaterialIcons'
import api from '../../services/api'

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

export default class Main extends Component {
  state = {
    newUser: '',
    users: [],
    loading: false
  }

  async componentDidMount() {
    const users = await AsyncStorage.getItem('users')

    if (users) {
      this.setState({
        users: JSON.parse(users)
      })
    }
  }

  async componentDidUpdate(props, prevState) {
    const { users } = this.state

    if (prevState.users !== users) {
      AsyncStorage.setItem('users', JSON.stringify(users))
    }
  }

  handleAddNewUser = async () => {
    this.setState({ loading: true })
    const { users, newUser } = this.state

    if (!newUser) {
      this.setState({ loading: false })
      return
    }

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
      newUser: '',
      loading: false
    })

    Keyboard.dismiss()
  }

  render() {
    const { users, newUser, loading } = this.state
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
          <SubmitButton onPress={this.handleAddNewUser} loading={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" size={20} />
            ) : (
              <Icon name="add" size={20} color="#fff" />
            )}
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
