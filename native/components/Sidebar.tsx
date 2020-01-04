import React from 'react';
import { Image, Text } from 'react-native';
import { Container, Content } from 'native-base';

interface SidebarProps {
  items: any;
}

export const Sidebar: React.SFC<SidebarProps> = props => {
  return (
    <Container>
      <Image
        source={{
          uri:
            'https://images.unsplash.com/photo-1499084732479-de2c02d45fcc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80'
        }}
        style={{
          height: 120,
          alignSelf: 'stretch',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      />
      <Content>
        <Text>Test</Text>
      </Content>
    </Container>
  );
};

export default Sidebar;
