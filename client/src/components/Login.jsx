import React from 'react';
import {
    VStack,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Button,
    useToast,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
const Login = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [show, setShow] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    const handlerSubmit = async () => {
        setLoading(true);
        if (!email || !password) {
            toast({
                title: 'Please fill in all input fields',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
            return;
        }
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            if (data) {
                setLoading(false);
                navigate('/chats');
            }
        } catch (error) {
            toast({
                title: error.response.data.message,
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
            return;
        }
    };
    return (
        <VStack spacing="5px">
            <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    type="email"
                    placeholder="Enter your email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? 'text' : 'password'}
                        placeholder="Enter your password..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement>
                        <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                            {show ? <ViewIcon /> : <ViewOffIcon />}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button
                colorScheme="blue"
                width="100%"
                style={{ marginTop: '20px' }}
                onClick={handlerSubmit}
                isLoading={loading}
            >
                Login
            </Button>
        </VStack>
    );
};

export default Login;
