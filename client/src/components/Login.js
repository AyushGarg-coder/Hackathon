import { Box, TextField, Button, Typography, styled } from '@mui/material'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ToastContainer, toast } from 'react-toastify'
import { DataContext } from './DataProvider'

const Container = styled(Box)`
margin:auto;
margin-top:64px;
width:400px;
box-shadow: 5px 2px 5px 2px rgb(0 0 0/0.6)
`

const Image = styled("img")({
    width: '100px',
    padding: '50px 0 0',
    margin: 'auto',
    display: 'flex',
})

const Wrapper = styled(Box)`
display:flex;
flex:1;
flex-direction:column;
padding:25px 35px;
&>div, &>button,&>p {
margin-top:20px;
}
`
const Text = styled(Typography)`
margin:auto;
color:gray;
font-size:16px;
`

const Loginbtn = styled(Button)`
text-transform: none;
height:48px;
border-radius:2px;
background-color:#5ba4ed;
color:#fff;
`

const Signupbtn = styled(Button)`
text-transform : none;
height:48px;
border-radius:2px;
box-shadow:0 2px 4px 0 rgb(0 0 0/20%);
`
const logininitialvalue = {
    username: '',
    password: '',
}

const signupinitialvalue = {
    username: '',
    password: '',
    email: ''
}

export default function Login({ isUserAuthenticated }) {
    const [account, setAccount] = useState("Login");
    const navigate = useNavigate();
    const [login, setLogin] = useState(logininitialvalue);
    const [signup, setSignup] = useState(signupinitialvalue);
    const {setAccount1}=useContext(DataContext);


    useEffect(() => {
        const check_auth = async () => {
            try {
                let token = sessionStorage.getItem('auth_token');
                let username = sessionStorage.getItem('username');
                console.log(token,username)
                if(token!="" && username!=""){
                    let response = await axios.post('https://hackathon-r38q.onrender.com/checkauth',{token})
                    if(response.status===200){
                        console.log(response.data)
                        if(response.data==username){
                        isUserAuthenticated(true);
                        navigate('/');
                    }
                    }
                }
                
            }
            catch (err) {
                if (err.message) {
                    toast.error(err.message)
                }
                else {
                    toast.error(err.data)
                }
            }
        }
        check_auth();
    }, [navigate, isUserAuthenticated])

    const handleChange = (e) => {
        if (account === 'Login') {
            setLogin({ ...login, [e.target.name]: e.target.value })
        }
        else {
            setSignup({ ...signup, [e.target.name]: e.target.value })
        }
    }

    const Loginfunc = async () => {
        try {
            if (login.username !== "" && login.password !== "") {
                let response = await axios.post('https://hackathon-r38q.onrender.com/login', login);
                if (response.status === 200) {
                    sessionStorage.setItem('auth_token', response.data['token']);
                    sessionStorage.setItem('username', response.data.username)
                    sessionStorage.setItem('email', response.data.email)
                    toast.success('Login Successfull');
                    isUserAuthenticated(true);
                    setLogin(logininitialvalue);
                    navigate('/',{state:{email:response.data.email,username:response.data.username}});
                }
            }
            else {
                toast.warning('Fields Cannot Be Empty');
            }
        }
        catch (err) {
            if (err.message) {
                toast.error("" + err.message);
            }
            else {
                toast.error(err.data);
            }
        }
    }

    const Signupfunc = async () => {
        try {
            if (signup.email !== "" && signup.username !== "" && signup.password !== "") {
                let response = await axios.post('https://hackathon-r38q.onrender.com/signup', signup);
                if (response.status === 200) {
                    if(response.data==="Data Saved Successfully"){
                        toast.success("Data Saved Successfully");
                    }
                    else{
                        toast.info(response.data);
                    }
                    setSignup
                        (signupinitialvalue);
                    setAccount('Login')
                }
            }
            else {
                toast.warning("Fields Cannot be empty")
            }
        }
        catch (err) {
            if (err.message) {
                toast.error("" + err.message);
            }
            else {
                toast.error(err.data);
            }
        }
    }

    return (
        <Container>
            <ToastContainer />
            <Box>

                <Image src="https://cdn-icons-png.flaticon.com/128/5900/5900097.png" alt='Logo' />
                {account === 'Login' ?
                    <Wrapper>
                        <TextField variant="standard"
                            name='username'
                            onChange={handleChange}
                            value={login.username}
                            label="Enter Username"
                            required
                        />
                        <TextField variant="standard"
                            name='password'
                            onChange={handleChange}
                            value={login.password}
                            label="Enter Password"
                            required
                        />
                        <Loginbtn variant="contained"
                            onClick={Loginfunc}
                        >Login</Loginbtn>
                        <Text>OR</Text>
                        <Signupbtn variant='text' onClick={() => { setAccount('Signup') }}>Create an account</Signupbtn>
                    </Wrapper>
                    :
                    <Wrapper>
                        <TextField variant="standard"
                            name="email"
                            label="Enter Email"
                            value={signup.email}
                            onChange={handleChange}
                            required
                        />

                        <TextField variant="standard"
                            name='username'
                            label="Enter Username"
                            value={signup.username}
                            onChange={handleChange}
                            required />
                        <TextField variant="standard"
                            name='password'
                            label="Enter Password"
                            value={signup.password}
                            onChange={handleChange}
                            required />
                        <Signupbtn variant='text' onClick={Signupfunc}>Signup</Signupbtn>
                        <Text>OR</Text>
                        <Loginbtn variant='contained' onClick={() => { setAccount('Login') }}>Already have an account</Loginbtn>
                    </Wrapper>
                }
            </Box>
        </Container>
    )
}
