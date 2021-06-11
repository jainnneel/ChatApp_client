import { Link, Redirect, useHistory } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import img from '../../images/iphone02.png'
import {ip} from '../ipvalue'

const Otpverify = (props) => {
    const history = useHistory();
    useEffect(() => {
        document.title = "Otp Verification";
        if (localStorage.getItem("token") !== null) {
            history.push("/");
        }
    }, []);

    const [record, setrecord] = useState({});
    const [loader, setloader] = useState(true);
    const Otp = (e) => {
        e.preventDefault();
        console.log(record)
        setrecord(record)
        postdatatoserver()
    }

    const postdatatoserver = () => {
        axios.post(`http://${ip}/otpverify`, record).then(
            (response) => {
                console.log(response.data);
                document.getElementById('otp').value = ''
                setloader(true)
                if (response.data.data === "otp successfully verify") {
                    props.history.push('/Login')
                } else if (response.data.data === "Otp is incorrect") {
                    alert('Otp is incorrect')
                }   
            },
            (Error) => {
                console.log(Error);
            }
        )
    }

    const resendOtp = () => {
        let mobile = localStorage.getItem('mobile');
        console.log(mobile)
        axios.get(`http://${ip}/resend/${mobile}`).then(
            (response) => {
                console.log(response.data);
                if (response.data.data === "done") {
                    props.history.push('/Login')
                }else{
                    alert('Something went wrong')
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
                        <h1 className="heading-login">OTP Verification</h1>
                        <p className="login-description">Enter OTP that has been sent to your registered mobile number to enjoy service.</p>
                        <h3>Is number entered correct?  <Link to="/register">Change nummber</Link></h3>
                    </div>
                    <div className="login">
                        {/* <img src={img}>
                                </img> */}
                        <form onSubmit={Otp} >
                            <div className="box-login">
                                <input onChange={(e) => setrecord({ ...record, otpDto: e.target.value })}
                                    id="otp" name="otp" type="number" placeholder="enter OTP here" />
                            </div>
                            <button id="verify"
                                className="button-login"
                                type="submit">
                                verify</button>
                            <button id="reset"
                                className="button-login"
                                type="button"
                                onClick={resendOtp}
                                >
                                resend</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )


}

export default Otpverify;