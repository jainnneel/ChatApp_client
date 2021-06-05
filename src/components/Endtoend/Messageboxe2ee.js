import React, { useState,useEffect } from 'react';
import moment from 'moment'
import axios from 'axios'
import SockJsClient from "react-stomp"


const Messageboxe2ee = (props) => {
    
    const [msgText,setmsgText] = useState({});
    const [chats,setchats] = useState([]);
    
        useEffect(()=>{
            setchats(props.chats)
        },[]);

   const sendMessageToServer = (e) => {
            e.preventDefault();
            console.log(msgText.message)
            if (msgText) { //to not send empty message
                let msgObj = {
                    message: msgText.message,
                    date: moment().format('LT')
                }
                console.log(msgObj)
                props.setNewMsgObj(msgObj)
            }
            setmsgText({ msgText: "" })
                let l = document.querySelector('.message-area').scrollHeight;
                 document.querySelector('.message-area').scrollTop =  l;
    }    

    const addMessagesToChat = () => {
        console.log('dadasd')
    }

    return (
        <>
            <div className="message-box w-3/5">
                <div className=" w-full relative h-full grid grid-flow-rows">
                    {/* Contact Options Bar */}
                    {/* {<Modal></Modal>} */}
                    <div className="user-bar flex w-full py-4 absolute inset-x-0 top-0 shadow-lg">
                        <div className="w-12 rounded-full relative h-12 text-center mx-2">
                            <img className="profile-picture absolute h-full object-cover self-center p-2" src={"/images/" + props.selectedUser.img} alt="dp" />
                        </div>
                        <div className="contact-name font-bold w-3/4 float-left py-2">{props.selectedUser.name}</div>
                        <div className="icons w-1/4 text-right mr-4">
                            <i className="fas fa-video p-2 text-l"></i>
                            <i className="fa fa-phone p-2 text-l"></i>
                            <i className="fa fa-ellipsis-v p-2 text-l"></i>
                        </div>
                    </div>
                    {/* Messages Area */}
                    <div className="message-area clearfix overflow-auto my-20 p-2">
                        {addMessagesToChat}
                    </div>
                    {/* Input Box and other Options */}
                    <div className="input-box flex p-4 bottom-0 absolute inset-x-0 bg-white shadow-inner">
                        <input className="msg-input p-2 w-4/5 float-left text-sm focus:outline-none focus:ring" placeholder="Write Message.."
                            onChange={(e) => setmsgText({...msgText,message:e.target.value})}>
                        </input>
                        <div className="icons py-2 w-1/5 text-center flex">
                            <i className="las la-grin p-2 text-xl"></i>
                            <i className="las la-paperclip p-2 text-xl"></i>
                            <i className="las la-image p-2 text-xl"></i>
                        </div>
                        <div className="bar text-gray-300 text-4xl px-4">|</div>
                        <button className="rounded-full focus:outline-none place-self-center transform hover:scale-110 motion-reduce:transform-none" onClick={(e) => sendMessageToServer(e)}>
                            <i className="lar la-paper-plane m-4 text-xl mx-4"></i>
                        </button>
                    </div>
                </div>
            </div>

        </>


    )
    

}

export default Messageboxe2ee;