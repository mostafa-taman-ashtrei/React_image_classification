import React from 'react';
import { Stack, Flex, Text } from '@chakra-ui/react';

import ThemeSwitch from './ThemeSwitch';

const Navbar: React.FC = () => (
    <Stack as="main" align="center">
        <Flex p="2" w="100%" as="nav" flexDirection="row" pt="4" justify="space-between" backgroundColor="green.400">
            <Text>MobileNet Classification</Text>
            <ThemeSwitch />
        </Flex>
    </Stack>
);

export default Navbar;
