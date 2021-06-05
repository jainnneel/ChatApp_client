import React,{useEffect,useState} from 'react'
import axios from 'axios';
import ContactList from './ContactList'
import Message from './Message'
import Profile from './Profile'
import './Chat.css'
import CryptoJS from "crypto-js";
import {Redirect,useHistory} from 'react-router-dom'
import moment from 'moment'
import SockJsClient from "react-stomp"


function Chat() {
    const history = useHistory();
    // const[state,setState] = useState({
    //         users: [],
    //         messageToUser: null,
    //         ws: null,
    //         chats: [],
    //         lastSentMessage: undefined,
    //         clientConnected: false,
    //         user : {}
    // })

    const [user,setUser] = useState({})
    const [messageToUser,setmessageToUser] = useState(null)
    const [chats,setchats] = useState([])
    const [lastSentMessage,setlastSentMessage] = useState(undefined)
    const [clientConnected,setclientConnected] = useState(false)
    const [users,setUsers] = useState([])
    const [clientRef,setclientRef] = useState({});

    useEffect(()=>{
        document.title="chat-window";
        if (localStorage.getItem('token') === undefined || localStorage.getItem('token') === null) {
                history.push("/login");
        }else{
            const  userId = localStorage.getItem('userId');
            try {
                axios.defaults.headers={
                    Authorization:`Bearer `+localStorage.getItem('token')
                }
                 axios.get('http://localhost:8081/users/'+userId).then((res) => {
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
    },[Object.keys(user).length])
    
    const setusersList = (user1) => {
        axios.post(`http://localhost:8081/getAllUserAddedByUser`,user1.mobile).then(
            (response) => {
                console.log(response.data);
                setUsers(response.data)
            },
             (Error) => {
                console.log(Error);
        })
    }
    const setusersList1 = () => {
        axios.post(`http://localhost:8081/getAllUserAddedByUser`,user.mobile).then(
            (response) => {
                console.log(response.data);
                setUsers(response.data)
            },
             (Error) => {
                console.log(Error);
        })
    }

    const  getSelectedUser = (selectedUser) => {
        document.getElementById('newmessage_'+selectedUser.mobile).classList.add('hide'); 
        setmessageToUser(selectedUser)
        // debugger;
        setuserschat(selectedUser)
    }

    const setuserschat = (user) => {
        try {
            axios.defaults.headers={
                Authorization:`Bearer `+localStorage.getItem('token')
            }
           axios.post(`http://localhost:8081/getUserChat`,JSON.stringify(user.mobile)).then(
                (response) => {
                        console.log(response.data)
                        setchats(response.data ) 
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
        try {
            axios.defaults.headers={
                Authorization:`Bearer `+localStorage.getItem('token')
            }
           axios.post(`http://localhost:8081/getUserChat`,JSON.stringify(messageToUser.mobile)).then(
                (response) => {
                        console.log(response.data)
                        setchats(response.data ) 
                    },
                    (Error) => {
                        console.log(Error);
                    }
           )
        } catch (error) {
            console.log("error:", error);
        }
    }

    const sendMessage  = async (msg) => {
        // debugger;
        let chatid = Date.now()*6747
        let data1 = {
            fromLogin: user.mobile,
            message: msg,
            date:moment().format('LT'),
            chatId:chatid,
            seenOrNot:'send',
            toUser:messageToUser.mobile,
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
            date:moment().format('LT'),
            chatId:chatid,
            seenOrNot:'send',
            toUser:messageToUser.mobile,
        }
      
        setchats([...chats,data])
        console.log(chats)
        clientRef.sendMessage("/app/chat/"+messageToUser.mobile, JSON.stringify(data));
         return true;
       } catch(e) {
         return false;
       }
    }

    const onMessageReceive = (msg, topic) => {
        console.log(JSON.stringify(msg)+'   '+topic)
        if(messageToUser && msg.fromLogin === messageToUser.mobile){
            setchats([...chats,msg])
            let data = {
                fromMobile : messageToUser.mobile,
                toMobile :  user.mobile
            }
            clientRef.sendMessage("/app/chat/readMessage", JSON.stringify(data));
        }else{
           document.getElementById('newmessage_'+msg.fromLogin).classList.remove('hide');     
        }
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
           } catch(e) {
             return false;
           }
    }

    return (
        <div className="chat-main">
            <div className="chat-left">
            { 
            Object.keys(user).length > 0 && 
            <>
            <Profile 
                addUserToList = {setusersList1}
                curuser={user}  
            ></Profile>
             
            <ContactList
               users={users}
               addUserToList = {setusersList1}
               selectedUser={getSelectedUser}
               chats={chats}
               curuser={user} 
               contactList = {setusersList1}
            ></ContactList>
            </>
            }
            </div>
            {messageToUser !== null?  
                <Message 
                        selectedUser={messageToUser}
                        loggedInUserDP='dsadad.dsa'
                        setNewMsgObj={sendMessage}
                        messages={chats}
                        setmessages = {setmessages}
                        curuser={user} 
                        setchatusers = {setchatusers}
                ></Message> : <div></div>
            }
            <SockJsClient url="http://localhost:8081/chat" topics={["/topic/messages/"+user?.mobile]}
                    onMessage={ onMessageReceive } 
                    ref={(client) => {     
                        setclientRef(client)
                    }}
                    onConnect={ () => { console.log("connected chatss")
                        setTimeout(() => sendOnline() , 2000);        
                    }}
                    onDisconnect={ () => { console.log("disconnected") } }
                    debug={ false }/>

        </div>
    )
}

export default Chat
