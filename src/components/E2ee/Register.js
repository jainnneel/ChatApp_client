import React, { useState,useEffect } from 'react';
import axios from 'axios'
import  { Redirect,useHistory } from 'react-router-dom'


const Register = (props) => {
    const history = useHistory();
    useEffect(()=>{
        document.title="Register For E2ee";
        console.log(props.location.state)
    },[]);

    const [record,setrecord] = useState({}); 
    const register = (e) => {
        e.preventDefault();
        console.log(record)
        setrecord(record)
        postdatatoserver()
    }

    const postdatatoserver = () => {
        axios.post(`http://localhost:8081/registere2ee`,record).then(
            (response) => {
                console.log(response.data);
                document.getElementById('username').value = ''

                if((response.data.status === "done" && response.data.httpStatus === "OK") || response.data.data ==="done"){
                       history.push({pathname:'/e2ee/chatwindow',state:{data : response.data.data}})
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
            <div className="bg-gray-900">
                <div className="login container mx-auto w-full max-w-xs items-center pt-12 h-screen">
                    <form  method="GET" className="bg-white shadow-md rounded px-8 pt-8 pb-8 m-4">
                        <label className="block text-lg font-bold mb-4 py-2 text-center bg-gray-800 rounded text-white">Registration</label>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Username : </label>
                            <label className="incorrect-user text-red-500"></label>
                            <input  onChange={(e) => setrecord({...record,username:e.target.value})}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="username" type="text" placeholder="Enter Username here..." />
                        </div>
                       
                        
                        <button id="login" onClick={register}
                            className="btn-primary rounded-full text-white font-bold py-2 px-4 mx-16 rounded focus:outline-none focus:shadow-outline place-self-center"
                            type="button">
                            Register</button>
                    </form>
                    
                </div>
            </div>

        </>

    )

}

export default Register;