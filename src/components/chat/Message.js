import React, { useState,useEffect } from 'react'
import { MdVideocam,MdCall,MdMoreVert,MdSend,MdDelete,MdCheck,MdDoneAll } from 'react-icons/md'
import Profile from './Profile'
import './Chat.css'
import img from '../../images/download.jpg'
import axios from 'axios';
import SockJsClient from "react-stomp"

import CryptoJS from "crypto-js";

function Message(props) {

    const [clientRef,setclientRef] = useState({});
    const [message,setMessage] = useState('') 
    const [readed,setAllRead] = useState(false)

    useEffect(()=>{
        console.log(props.messages)
    })
    const  deletemessage = (e,chatid,mid) => {
        e.preventDefault()
        console.log(chatid)
        e.stopPropagation();
        
        try {
            axios.defaults.headers={
                Authorization:`Bearer `+localStorage.getItem('token')
            }
            console.log(JSON.stringify(mid))
           axios.post(`http://localhost:8081/deleteuser`,JSON.stringify(mid)).then(
               (response) => {
                   console.log(response.data);
                   if(response.data.status==="done"){
                    props.setmessages(mid);
                   }
               },
               (Error) => {
                   console.log(Error);
               }
           )
            
        } catch (error) {
            console.log("error:", error);
        }
    }
    const sendmessage = () => {
        if(message !== ''){
            props.setNewMsgObj(message)
            document.getElementById('messagebox').value = ''
        }
        setMessage('')
    }

    const onMessagedeletemessageReceive = (msg) => {
        console.log(msg)
        // debugger
        if(msg.fromMobile === props.selectedUser.mobile){
            document.getElementById('chatid_'+msg.id).innerHTML = ''
        }
    }

    const onreadMessages = (msg) => {
        props.setchatusers()
    }

    return (
        <>
    <div className="message-box">
            <div className="profile-chat">
            <div className="prof-chat">
            <img src={img}>
            </img>
            <h1>
                {props.selectedUser.name}
            </h1>
            </div>
            <div className="noti-chat">

            <MdVideocam color="white" size="1.5rem"></MdVideocam>
            <MdCall color="white" size="1.5rem"></MdCall>
            <MdMoreVert color="white" size="1.5rem"></MdMoreVert>
            </div>
            </div>
    
            <div className="box-main">
                {
                    props.messages.map((chat,index)=>{
                        // debugger
                        console.log(readed)
                        let key = "12345678901234567890123456789012";
                        key = CryptoJS.enc.Utf8.parse(key);
                        let iv = "1234567890123456";
                        iv = CryptoJS.enc.Utf8.parse(iv);
                        let decrypted = CryptoJS.AES.decrypt(chat.message, key, { iv: iv });
                        return(
                            <div key={chat.chatId} id={"chatid_"+chat.chatId} className="messages">
                                     <p className={`${props.selectedUser.mobile === chat.fromLogin?"left":"right"} message`}>
                                        {(props.selectedUser.mobile !== chat.fromLogin)?
                                            <MdDelete onClick={(e) => deletemessage(e,index,chat.chatId)}  color="white" size="1.5rem"></MdDelete> : null}
                                            <p className={`${(props.selectedUser.mobile === chat.fromLogin)?"left-color":"right-color"} data`}><p>{decrypted.toString(CryptoJS.enc.Utf8)}</p>
                                            
                                        {(props.selectedUser.mobile !== chat.fromLogin)?
                                            <div className="time ">
                                                {chat.date}
                                                {chat.seenOrNot === "seen"  ?   <MdDoneAll color="#00c9c8" size="1rem"></MdDoneAll> : <MdCheck color="white" size="1rem"></MdCheck> }
                                            </div>:
                                            <div className=" reciever">
                                                {chat.date} 
                                            </div>
                                        }
                                        </p>    
                                     </p>
                                </div>
                        )
                    })
                }
            </div>
            <div className="bottom-chat">
                    <input placeholder="Type message here..."  id='messagebox' onChange={(e) => setMessage(e.target.value)} />
                    <button onClick={sendmessage} ><MdSend color="white" size="2rem"></MdSend></button>
            </div>
            
        </div>
        <SockJsClient url="http://localhost:8081/chat" topics={["/topic/readMessages/"+props.curuser.mobile]}
            onMessage={ onreadMessages } 
            ref={ (client) => { setclientRef(client) }}
            onConnect={ () => { console.log("connected3")}}
            onDisconnect={ () => { console.log("disconnected") } }
            debug={ false }/>

        <SockJsClient url="http://localhost:8081/chat" topics={["/topic/deletemessages/"+props.curuser.mobile]}
            onMessage={ onMessagedeletemessageReceive } 
            ref={ (client) => { setclientRef(client) }}
            onConnect={() => { console.log("connect") } }
            onDisconnect={ () => { console.log("disconnected") } }
            debug={ false }/>
        </>
    )
}

export default Message
