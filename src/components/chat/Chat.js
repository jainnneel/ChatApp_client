import React, { useEffect, useState } from 'react'
import axios from 'axios';
import ContactList from './ContactList'
import Message from './Message'
import Profile from './Profile'
import './Chat.css'
import CryptoJS from "crypto-js";
import { Redirect, useHistory } from 'react-router-dom'
import moment from 'moment'
import SockJsClient from "react-stomp"
import {ip} from '../ipvalue'

function Chat() {
    const history = useHistory();

    const [user, setUser] = useState({})
    const [messageToUser, setmessageToUser] = useState({})
    const [chats, setchats] = useState([])
    const [lastSentMessage, setlastSentMessage] = useState(undefined)
    const [clientConnected, setclientConnected] = useState(false)
    const [users, setUsers] = useState([])
    const [clientRef, setclientRef] = useState({});
    const [messageTogroup, setmessageToGroup] = useState({})
    const [groupchat, setGroupChat] = useState({})
    const [isUser, setIsUser] = useState(false)
    const [isChatOpen,setChatOpen] = useState(false)
    const ipaddr =`http://${ip}/chat`;

    useEffect(() => {
        document.title = "chat-window";
        if (localStorage.getItem('token') === undefined || localStorage.getItem('token') === null) {
            history.push("/login");
        } else {
            const userId = localStorage.getItem('userId');
            try {
                axios.defaults.headers = {
                    Authorization: `Bearer ` + localStorage.getItem('token')
                }
                axios.get(`http://${ip}/users/` + userId).then((res) => {
                    // debugger;    
                    console.log(res.data.data)
                    let userdata = res.data.data
                    setUser(userdata)
                    setusersList(res.data.data)
                })
            } catch (error) {
                console.log("error:", error);
            }
        }
    }, [Object.keys(user).length])

    const setusersList = (user1) => {
        axios.defaults.headers = {
            Authorization: `Bearer ` + localStorage.getItem('token')
        }
        axios.get(`http://${ip}/userlist`).then(
            (response) => {
                console.log(response.data.data);
                // debugger
                setUsers(response.data.data)
            },
            (Error) => {
                console.log(Error);
            })
    }
    const setusersList1 = () => {
        axios.defaults.headers = {
            Authorization: `Bearer ` + localStorage.getItem('token')
        }
        axios.get(`http://${ip}/userlist`).then(
            (response) => {
                console.log(response.data.data);
                setUsers(response.data.data)
            },
            (Error) => {
                console.log(Error);
            })
    }

    const getSelectedGroup = (selectedGroup) => {
        document.getElementById('newmessage_' + selectedGroup.groupId).classList.add('hide');
        setmessageToGroup(selectedGroup)
        setmessageToUser({})
        setIsUser(false)
        console.log(selectedGroup)
        setGroupChats(selectedGroup)
        setChatOpen(true)
        
        // debugger;
        // setGroupChat(selectedGroup)
    }

    const setGroupChats = (group) => {
        try {
            axios.defaults.headers = {
                Authorization: `Bearer ` + localStorage.getItem('token')
            }
            axios.get(`http://${ip}/stock/groupchats/${group.groupId}`).then(
                (response) => {
                    console.log(response.data.data)
                    setchats(response.data.data)
                    // setGroupChat(response.data.data)
                },
                (Error) => {
                    console.log(Error);
                }
            )
        } catch (error) {
            console.log("error:", error);
        }
    }


    const getSelectedUser = (selectedUser) => {
        document.getElementById('newmessage_' + selectedUser.mobile).classList.add('hide');
        setIsUser(true)
        setmessageToGroup({})
        setmessageToUser(selectedUser)
        setuserschat(selectedUser)
        setChatOpen(true)
        // var elem = document.querySelector('.box-main')
        // elem.scrollTop = elem.scrollHeight;
    }

    const setuserschat = (user) => {
        // debugger
        try {
            axios.defaults.headers = {
                Authorization: `Bearer ` + localStorage.getItem('token')
            }
            axios.post(`http://${ip}/getUserChat`, JSON.stringify(user.mobile)).then(
                (response) => {
                    console.log(response.data)
                    setchats(response.data)
                },
                (Error) => {
                    console.log(Error);
                }
            )
        } catch (error) {
            console.log("error:", error);
        }
    }

    const setchatusers = () => {
        if(isUser){
            try {
                axios.defaults.headers = {
                    Authorization: `Bearer ` + localStorage.getItem('token')
                }
                axios.post(`http://${ip}/getUserChat`, JSON.stringify(messageToUser.mobile)).then(
                    (response) => {
                        console.log(response.data)
                        setchats(response.data)
                    },
                    (Error) => {
                        console.log(Error);
                    }
                )
            } catch (error) {
                console.log("error:", error);
            }
        }
    }

    const sendMessage = async (msg) => {
        // debugger;
        if (isUser) {
            let chatid = Date.now() * 6747
            let data1 = {
                fromLogin: user.mobile,
                message: msg,
                date: moment().format('LT'),
                chatId: chatid,
                seenOrNot: 'send',
                toUser: messageToUser.mobile,
            }
            console.log(msg)
            let key = "12345678901234567890123456789012";
            key = CryptoJS.enc.Utf8.parse(key);

            let iv = "1234567890123456";
            iv = CryptoJS.enc.Utf8.parse(iv);
            const message = msg;

            let encrypted = CryptoJS.AES.encrypt(message, key, { iv: iv });
            try {
                let data = {
                    fromLogin: user.mobile,
                    message: encrypted.toString(),
                    date: moment().format('LT'),
                    chatId: chatid,
                    seenOrNot: 'send',
                    toUser: messageToUser.mobile,
                }

                setchats([...chats, data])
                console.log(chats)
                clientRef.sendMessage("/app/chat/" + messageToUser.mobile, JSON.stringify(data));
                return true;
            } catch (e) {
                return false;
            }
        } else {
            // debugger
            let chatid = Date.now() * 6747
            let data1 = {
                fromLogin: user.mobile,
                message: msg,
                date: moment().format('LT'),
                chatId: chatid,
                toUser: messageTogroup.groupId,
            }
            console.log(msg)
            let key = "12345678901234567890123456789012";
            key = CryptoJS.enc.Utf8.parse(key);

            let iv = "1234567890123456";
            iv = CryptoJS.enc.Utf8.parse(iv);
            const message = msg;
            let encrypted = CryptoJS.AES.encrypt(message, key, { iv: iv });
            try {
                let data = {
                    fromLogin: user.mobile,
                    message: encrypted.toString(),
                    date: moment().format('LT'),
                    chatId: chatid,
                    toUser: messageTogroup.groupId,
                }
                setchats([...chats, data])
                console.log(chats)
                clientRef.sendMessage("/app/chat/group/" + messageTogroup.groupId, JSON.stringify(data));
            }catch(e){
                console.log(e)
            }
        //     var elem = document.querySelector('.box-main')
        //    elem.scrollTop = elem.scrollHeight;
    }
 }

const onMessageReceive = (msg, topic) => {
    console.log(JSON.stringify(msg) + '   ' + topic)
    if (!msg.forgroup) {
            if (messageToUser && msg.fromLogin === messageToUser.mobile) {
                setchats([...chats, msg])
                let data = {
                    fromMobile: messageToUser.mobile,
                    toMobile: user.mobile
                }
                clientRef.sendMessage("/app/chat/readMessage", JSON.stringify(data));
            } else {
                document.getElementById('newmessage_' + msg.fromLogin).classList.remove('hide');
            }
    }else{
        if (messageTogroup && msg.toUser === messageTogroup.groupId) {
            setchats([...chats, msg])
        }else{
            document.getElementById('newmessage_' + msg.toUser).classList.remove('hide');
        }
    }
    // var elem = document.querySelector('.box-main')
    // elem.scrollTop = elem.scrollHeight;
}

const setmessages = (mid) => {
    console.log(chats)
    setchats(chats.filter(chat => chat.chatId !== mid))
    console.log(chats)
}

const sendOnline = async () => {
    // debugger;
    try {
        clientRef.sendMessage("/app/chat/online", JSON.stringify({
            mobile: user.mobile,
        }));
        return true;
    } catch (e) {
        return false;
    }
}

return (
    <div className="chat-main">
        <div className="chat-left">
            {
                Object.keys(user).length > 0 &&
                Object.keys(users).length > 0 &&
                <>
                    <Profile
                        addUserToList={setusersList1}
                        curuser={user}
                    ></Profile>

                    <ContactList
                        users={users}
                        addUserToList={setusersList1}
                        selectedUser={getSelectedUser}
                        selectedGroup={getSelectedGroup}
                        chats={chats}
                        curuser={user}
                        contactList={setusersList1}
                    ></ContactList>
                </>
            }
        </div>
        { isChatOpen ?
            <Message
                chatopen = {setChatOpen}
                selectedUser={messageToUser}
                selectedGroup={messageTogroup}
                loggedInUserDP='dsadad.dsa'
                setNewMsgObj={sendMessage}
                messages={chats}
                setmessages={setmessages}
                curuser={user}
                setchatusers={setchatusers}
                isUser = {isUser}
                setusersList1 = {setusersList1}
            ></Message> : <div></div>
        }
        <SockJsClient url={ipaddr} topics={["/topic/messages/" + user?.mobile]}
            onMessage={onMessageReceive}
            ref={(client) => {
                setclientRef(client)
            }}
            onConnect={() => {
                console.log("connected chatss")
                setTimeout(() => sendOnline(), 2000);
            }}
            onDisconnect={() => { console.log("disconnected") }}
            debug={false} />

    </div>
)
}

export default Chat
