import React from 'react';
import axios from 'axios';
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
const Signup = () => {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [show, setShow] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [avatar, setAvatar] = React.useState();
    const toast = useToast();
    const navigate = useNavigate();
    const postDetails = (picture) => {
        setLoading(true);
        if (picture === undefined) {
            toast({
                title: 'Please select a picture',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            return;
        }
        if (picture.type === 'image/jpeg' || picture.type === 'image/png') {
            const data = new FormData();
            data.append('file', picture);
            data.append('upload_preset', 'chat-app');
            data.append('cloud_name', 'dxguh35gk');
            fetch('https://api.cloudinary.com/v1_1/dxguh35gk/image/upload', {
                method: 'post',
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setAvatar(data.url.toString());
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
        } else {
            toast({
                title: 'Please select a picture',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
        }
    };
    const handlerSubmit = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmPassword) {
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
        if (password !== confirmPassword) {
            toast({
                title: 'Password and confirm password do not match',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            return;
        }
        try {
            const { data } = await axios.post('/api/auth/register', {
                name,
                email,
                password,
                avatar,
            });
            toast({
                title: 'Register successfully',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
            if (data) {
                setLoading(false);
                navigate('/chats');
            }

            return;
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
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder="Enter your name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
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
            <FormControl isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input
                        type={show ? 'text' : 'password'}
                        placeholder="Enter your confirm password..."
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <InputRightElement>
                        <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                            {show ? <ViewIcon /> : <ViewOffIcon />}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl>
                <FormLabel>Upload your avatar</FormLabel>
                <Input
                    type="file"
                    p={1.5}
                    accept="image/*"
                    onChange={(e) => postDetails(e.target.files[0])}
                />
            </FormControl>
            <Button
                colorScheme="blue"
                width="100%"
                style={{ marginTop: '20px' }}
                onClick={handlerSubmit}
                isLoading={loading}
            >
                Sign Up
            </Button>
        </VStack>
    );
};

export default Signup;
