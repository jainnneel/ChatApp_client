import {Link, useHistory} from 'react-router-dom';
import React, { useState,useEffect } from 'react';
import axios from 'axios';
import  { Redirect } from 'react-router-dom'
import img from '../../images/iphone02.png'
import {ip} from '../ipvalue'

const Register = (props) => {
    const history = useHistory();
    useEffect(()=>{
        document.title="Register";
        if (localStorage.getItem("token")!==null) {
            history.push("/");
        }
    },[]);

    const [record,setrecord] = useState({
        username:"",
        mobile:"",
        pass:"",
    }); 
    const [loader,setloader] = useState(true);
    const register = (e) => {
        e.preventDefault();
        console.log(record)
        // debugger
        setrecord(record)
        postdatatoserver()
    }

    const postdatatoserver = () => {
        axios.post(`http://${ip}/register`,record).then(
            (response) => {
                console.log(response.data);
                // document.getElementById('username').value = ''
                // document.getElementById('mobile').value = ''
                // document.getElementById('pass').value = ''
                setloader(true)

                if((response.data.status === "otp send" && response.data.httpStatus === "OK") || response.data.data ==="user mobile not verified !! otp send plz verify"){
                    localStorage.setItem('mobile',record.mobile)   
                    props.history.push('/verify')
                }else if(response.data.status === "invalid data"){
                        alert('Data is not in required format')
                }else if(response.data.data === "user already exist"){
                        alert('User Already Exist')
                }

            },
            (Error) => {
                console.log(Error);
            }
        )
    }



    return (
        <>
        {/* <h1>Registration</h1>     */}
        <div className="bg-login">
                <div className="heading">
                    <div className="desc">
                    <h1 className="heading-login">Register</h1>
                    <p className="login-description">Register with your username, mobile number and password to start chatting.</p>
                                <h3>Already have an account?  <Link to="/login">Login</Link></h3>
                    </div>
                    <div className="login">
                        {/* <img src={img}>
                                </img> */}
                        <form onSubmit={register} >
                            <div className="box-login">
                                <input onChange={(e) => setrecord({...record,username:e.target.value})}
                                id="username" name="username" value={record.username} type="text"  />
                                <label className="label-login" htmlFor="username">
                                username</label>
                            </div>
                            <div className="box-login">
                                <input onChange={(e) => setrecord({...record,mobile:e.target.value})}
                                id="username" name="username" value={record.mobile} type="text"  />
                                <label className="label-login" htmlFor="username">
                                mobile no.</label>
                            </div>
                            <div className="box-login">
                                <input onChange={(e) => setrecord({...record,pass:e.target.value})}
                                id="password" name="password" value={record.pass} type="password"   />
                                <label className="label-login" htmlFor="password">
                                password</label>
                            </div>
                            <button  id="register" 
                            className="button-login"
                            type="submit">
                            register</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )

}

export default Register; 
