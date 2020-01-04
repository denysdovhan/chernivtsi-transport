import React from 'react';
import { Text } from 'react-native';
import {
  Container,
  Header,
  Body,
  Title,
  Content,
  Left,
  Button,
  Icon,
  Right
} from 'native-base';

export default props => {
  return (
    <Container>
      <Header>
        <Left>
          <Button transparent onPress={() => props.navigation.openDrawer()}>
            <Icon name="menu" />
          </Button>
        </Left>
        <Body>
          <Title>HomeScreen</Title>
        </Body>
        <Right />
      </Header>
      <Content padder>
        <Text>Test app</Text>
      </Content>
    </Container>
  );
};
