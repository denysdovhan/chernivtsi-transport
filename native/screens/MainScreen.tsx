import React from 'react';
import {
  Container,
  Header,
  Body,
  Title,
  Left,
  Button,
  Icon,
  Right
} from 'native-base';
import Map from '../components/Map';
import Tracker from '../components/Tracker';

export default props => {
  return (
    <Container>
      <Header>
        <Left>
          <Button transparent onPress={() => props.navigation.toggleDrawer()}>
            <Icon name="menu" />
          </Button>
        </Left>
        <Body>
          <Title>Transport</Title>
        </Body>
        <Right>
          <Button transparent onPress={() => props.navigation.toggleDrawer()}>
            <Icon type="FontAwesome" name="filter" />
          </Button>
        </Right>
      </Header>

      <Map>
        <Tracker />
      </Map>
    </Container>
  );
};
