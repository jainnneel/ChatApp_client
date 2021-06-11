import API from '../../services/api'
import React, { useState,useEffect } from 'react';
import axios from 'axios';
import  { Redirect,useHistory } from 'react-router-dom'
import {messaging} from '../web-push/init-fcm'
import './login.css'
import img from '../../images/iphone02.png'
import {Link} from 'react-router-dom';
import {ip} from '../ipvalue'

// const NodeRSA = require('node-rsa');

const Login = (props) => {
    const history = useHistory();
    useEffect(()=>{
        document.title="Login";
        if (localStorage.getItem("token")!== null) {
            debugger;
            history.push("/");
        }
    },[]);
    const [record,setrecord] = useState({
        username:"",
        password:""
    }); 
    const [loader,setloader] = useState(true);
   
    const login = (e) => {
        e.preventDefault();
        console.log(record)
        setrecord(record)
        postdatatoserver()
        localStorage.setItem('usernamex',record.username);
    }

    const postdatatoserver = () => {

        var form_data = new FormData();
         form_data.set('username',record.username)
         form_data.set('password',record.password)
        axios.post(`http://${ip}/loginrequest`,form_data).then(
            (response) => {
                console.log(response);
                console.log(response.data);
                // document.getElementById('mobile').value = ''
                // document.getElementById('pass').value = ''
                setloader(true)

                if(response.data.status === "success" && response.data.httpStatus === "OK"){
                    console.log(props)
                    localStorage.setItem('userId',response.data.data.mobile);
                    localStorage.setItem('token',response.data.token);
                    // console.log(setLoggedinUser)
                    // props.setLoggedinUser(response.data.data)
                    console.log(response.data.data)
                    
                    if (messaging!=null) {
                        messaging.requestPermission()
                            .then(async function() {
                                const token = await messaging.getToken();
                                console.log(token)
                                axios.post(`http://${ip}/noti`,JSON.stringify(token)).then(
                                    (response) => {
                                        console.log(response.data);
                                    },
                                    (Error) => {
                                        console.log(Error);
                                    }
                                )
                            })
                            .catch(function(err) {
                                console.log("Unable to get permission to notify.", err);
                            });
                    } 
                    history.push({pathname:'/',state:{data : response.data.data}})
                }else if(response.data.data === "Wrong username or password"){
                        alert('Wrong username or password')
                }else if (response.data.data === "Number is not verified") {
                        alert('first verify mobile number')
                        localStorage.setItem('mobile',response.data.data.mobile)   
                        props.history.push('/verify')
                }
            },
            (Error) => {
                console.log(Error);
            }
        )
    }


    return (
        <>
             <div className="bg-login">
                <div className="heading">
                    <div className="desc">
                    <h1 className="heading-login">Login</h1>
                    <p className="login-description">Login with your registered mobile number and password to enjoy chatting.</p>
        <h3>Don't have an account?  <Link to="/register">Register</Link></h3>
                    </div>
                    <div className="login">
                        {/* <img src={img}>
                                </img> */}
                        <form onSubmit={login} >
                            <div className="box-login">
                                <input onChange={(e) => setrecord({...record,username:e.target.value})}
                                id="username" name="username" value={record.username} type="text"  />
                                <label className="label-login" htmlFor="username">
                                mobile no.</label>
                            </div>
                            <div className="box-login">
                                <input onChange={(e) => setrecord({...record,password:e.target.value})}
                                id="password" name="password" value={record.password} type="password"  />
                                <label className="label-login" htmlFor="password">
                                password</label>
                            </div>
                            <button  id="login" 
                            className="button-login"
                            type="submit">
                            login</button>
                        </form>
                    </div>
                </div>
            </div>

        </>

    )
}
export default Login;

// export default class Login extends Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//             username: "",
//             password: ""
//         }
//     }

//     onLoginComplete = (loggedInUserObj) => {
//         this.props.loginProp(loggedInUserObj)
//         console.log(this.props)
//     }

//     login = async () => {
//         // Call Login API to get user ID if the user exists in DB
//         try {
//             let loginResult = await API.logIn(this.state.username)
//             this.onLoginComplete(loginResult.data)
//         } catch (error) {
//             let element = document.querySelector(".incorrect-user")
//             element.innerText = "Some Error Occurred."
//         }
//     }

//     handleUser = e => {
//         this.setState({ username: e.target.value })
//     }
//     render() {
//         return (
//             <div className="bg-gray-900">
//                 <div className="login container mx-auto w-full max-w-xs items-center pt-12 h-screen">
//                     <form action="chat.html" method="GET" className="bg-white shadow-md rounded px-8 pt-8 pb-8 m-4">
//                         <label className="block text-lg font-bold mb-4 py-2 text-center bg-gray-800 rounded text-white">Login</label>
//                         <div className="mb-4">
//                             <label className="block text-gray-700 text-sm font-bold mb-2">
//                                 Username</label>
//                             <label className="incorrect-user text-red-500"></label>
//                             <input value={this.state.username} onChange={(e) => this.handleUser(e)}
//                                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                 id="username" type="text" placeholder="Enter Username here..." />
//                         </div>
//                         <div className="mb-4">
//                             <label className="block text-gray-700 text-sm font-bold mb-2">
//                                 Password</label>
//                             <label className="incorrect-user text-red-500"></label>
//                             <input value={this.state.username} onChange={(e) => this.handleUser(e)}
//                                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                 id="username" type="text" placeholder="Enter Username here..." />
//                         </div>
//                         <button id="login" onClick={() => this.login()}
//                             className="btn-primary rounded-full text-white font-bold py-2 px-4 mx-16 rounded focus:outline-none focus:shadow-outline place-self-center"
//                             type="button">
//                             Login</button>
//                             <Link  tag="a" to="/Register" action>new user register hear...</Link>
//                     </form>
                    
//                 </div>
//             </div>
//         )
//     }
// }