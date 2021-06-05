import React, { Component } from 'react'
import ContactList from './contactList'
import MessageBox from './messageBox'
import API from '../../services/api'
import SockJsClient from "react-stomp"
import axios from 'axios'
import Modal from './Modal'
import CryptoJS from "crypto-js";
import Endtoendchatwindow from '../Endtoend/Endtoendchatwindow'
import {Link} from 'react-router-dom'

export default class ChatWindow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            messageToUser: "",
            ws: null,
            chats: [],
            lastSentMessage: undefined,
            clientConnected: false,
            user : {}
        }
        this.getSelectedUser = this.getSelectedUser.bind(this)
        this.sendMessage = this.sendMessage.bind(this)
        this.sendOnline = this.sendOnline.bind(this)
        this.onMessageReceive = this.onMessageReceive.bind(this)
        this.setmessages = this.setmessages.bind(this)
        // this.onMessagedeletemessageReceive = this.onMessagedeletemessageReceive.bind(this)
        this.clientRef = null;        
    }

    onMessageReceive = (msg, topic) => {
        console.log(JSON.stringify(msg)+'   '+topic)
        // debugger;
        if(msg.fromLogin === this.state.messageToUser.mobile){
            this.setState(prevState => ({
                chats: [...prevState.chats,msg]
            }));
            
            let data = {
                fromMobile : this.state.messageToUser.mobile,
                toMobile :  this.props.history.location.state.data.mobile
            }
    
            this.clientRef.sendMessage("/app/chat/readMessage", JSON.stringify(data));
        
        }else{
           document.getElementById('newmessage_'+msg.fromLogin).classList.remove('hide');     
        }
        // let l = document.querySelector('.message-area').scrollHeight;
        // document.querySelector('.message-area').scrollTop =  l;
      }

    async componentDidMount() {

        // API call to fetch all contacts
        // console.log(this.props.loggedInUserObj.mobile)
        console.log(this.props.history)
        if(localStorage.getItem('token') === null || localStorage.getItem('token') === undefined){
            this.props.history.push('/login')
        }
        
        this.setState({user : this.props.history.location.state.data})

        try {
            axios.defaults.headers={
                Authorization:`Bearer `+localStorage.getItem('token')
            }
           axios.post(`http://localhost:8081/getAllUserAddedByUser`,this.props.history.location.state.data.mobile).then(
               (response) => {
                   console.log(response.data);
                   this.setState({ users: response.data})
               },
               (Error) => {
                   console.log(Error);
               }
           )
            
        } catch (error) {
            console.log("error:", error);
        }

        navigator.serviceWorker.addEventListener("message", (message) => 
        { 
        debugger;
        console.log(message)
        }
  );
        
    }


    // Method To Update the Selected User from Contact List Component to the Message Box Component
    getSelectedUser(selectedUser) {
        document.getElementById('newmessage_'+selectedUser.mobile).classList.add('hide'); 
        this.setState({ messageToUser: selectedUser })

        try {
            axios.defaults.headers={
                Authorization:`Bearer `+localStorage.getItem('token')
            }
            // console.log(JSON.stringify(selectedUser.mobile))
           axios.post(`http://localhost:8081/getUserChat`,JSON.stringify(selectedUser.mobile)).then(
                (response) => {
                        //    console.log(response.data);
                        this.setState({ chats: response.data }) 
                        //    console.log(this.state.chats)
                    },
                    (Error) => {
                        console.log(Error);
                    }
           )
        //    let l = document.querySelector('.message-area').scrollHeight;
        //    document.querySelector('.message-area').scrollTop =  l;
        } catch (error) {
            console.log("error:", error);
        }
    }

    async sendMessage(msg){
        let data1 = {
            fromLogin: this.props.history.location.state.data.mobile,
            message: msg.message,
            date:msg.date,
            chatId:Date.now()*this.props.history.location.state.data.mobile,
            seenOrNot:'send',
            toUser:this.state.messageToUser.mobile,
        }
        
        console.log(msg)
        // console.log(this.state.messageToUser.mobile)
        let key = "12345678901234567890123456789012";
        key = CryptoJS.enc.Utf8.parse(key);

        let iv = "1234567890123456";
        iv = CryptoJS.enc.Utf8.parse(iv);
        const message = msg.message;

        let encrypted = CryptoJS.AES.encrypt(message, key, { iv: iv });
        // debugger;
       try {
           let data = {
            fromLogin: this.props.history.location.state.data.mobile,
            message: encrypted.toString(),
            date:msg.date,
            chatId:Date.now()*6747,
            seenOrNot:'send',
            toUser:this.state.messageToUser.mobile,
        }
        this.setState(prevState => ({
            chats: [ ...prevState.chats,data],
         }));
        // console.log(data1)
        this.clientRef.sendMessage("/app/chat/"+this.state.messageToUser.mobile, JSON.stringify(data));
       
    //    let l = document.querySelector('.message-area').scrollHeight;
    //    document.querySelector('.message-area').scrollTop =  l;
         return true;
       } catch(e) {
         return false;
       }
     }

     async sendOnline(){
        //  console.log(this.clientRef)
        try {
            this.clientRef.sendMessage("/app/chat/online", JSON.stringify({
                mobile: this.props.history.location.state.data.mobile,
           }));
             return true;
           } catch(e) {
             return false;
           }
     }
     

    // Method to return the chatID of the Currently Selected User
    getSelectedUserChatId() {
    //     // Because of the state selectedUserChatId problem, we are selecting the chatId everytime a new message is being sent
    //     let selectedUserChatId = undefined
    //     for (let chat of Object.values(this.state.chats)) {
    //         if (chat.members.includes(this.state.messageToUser._id)) {
    //             selectedUserChatId = chat.chatId
    //             break
    //         }
    //     }
    //     return selectedUserChatId
    }

    setmessages(mid){
        console.log(this.state.chats)
        this.setState({
            chats: this.state.chats.filter(chat => 
                    chat.chatId !== mid
            ) 
        })
        console.log(this.state.chats)
    }

    

    // onMessagedeletemessageReceive = (msg) => {
    //     console.log(msg)
    //     // this.setmessages(msg);
    // }

    render() {
        console.log(this.props)    
        return (
            
            <div className="container flex mx-auto m-2 rounded h-screen bg-white border border-blue-800 bg-gray-100">
                
                {<ContactList
                    users={this.state.users}
                    selectedUser={this.getSelectedUser}
                    chats={this.state.chats}
                    curuser={this.props.history.location.state.data}
                />}
                   {/* <Link  to = {
                       {
                           pathname:'/e2ee/chatwindow',
                           state:this.state
                       }
                   } >go to e2ee</Link> */}
                {this.state.messageToUser && <MessageBox
                    selectedUser={this.state.messageToUser}
                    loggedInUserDP={this.props.history.location.state.data.img}
                    setNewMsgObj={this.sendMessage}
                    messages={this.state.chats}
                    setmessages = {this.setmessages}
                    curuser={this.props.history.location.state.data}
                />}
                <SockJsClient url="http://localhost:8081/chat" topics={["/topic/messages/"+this.props.history.location.state.data.mobile]}
                    onMessage={ this.onMessageReceive } 
                    ref={ (client) => {     
                        this.clientRef = client 
                    }  
                    }
                    onConnect={ () => { console.log("connected")
                    setTimeout(() => this.sendOnline(), 2000);        
                  } }
                    onDisconnect={ () => { console.log("disconnected") } }
                    debug={ false }/>
                 
                 
                 {/* <SockJsClient url="http://localhost:8081/chat" topics={["/topic/deletemessages/"+this.props.history.location.state.data.mobile]}
                    onMessage={ this.onMessagedeletemessageReceive } 
                    ref={ (client) => {     
                        this.clientRef = client 
                    }  
                    }
                    onConnect={ () => { console.log("connected")
                    setTimeout(() => this.sendOnline(), 1000);        
                  } }
                    onDisconnect={ () => { console.log("disconnected") } }
                    debug={ false }/>                   */}
                    
            </div>
        )
    }
}
// let url = "http://localhost:8080/chat";
            // Method to Send New Message using Web Socket when User hits send button from Message Box component
    // async getNewMsgObj(newMsgObj) {
    //     // let selectedUserChatId = this.getSelectedUserChatId()
    //     // let msgToSend = { chatId: selectedUserChatId, senderid: this.props.loggedInUserObj._id, receiverid: this.state.messageToUser._id, ...newMsgObj }
    //     // Send Message for Encryption to Signal Server, then send the Encrypted Message to Push server
    //     try {
    //         // let encryptedMessage = await this.props.signalProtocolManagerUser.encryptMessageAsync(this.state.messageToUser._id, newMsgObj.message);
    //         // msgToSend.message = encryptedMessage
    //         // this.state.ws.send(JSON.stringify(msgToSend))
    //         // this.setState({ lastSentMessage: newMsgObj.message }) // Storing last-sent message for Verification with Received Message
        
    //     } catch (error) {
    //         console.log(error);
    //     }
        
    // }
    // messages={(this.state.chats[this.getSelectedUserChatId()]) && this.state.chats[this.getSelectedUserChatId()].messages}



        // let contactsResult = await API.getContacts(this.props.loggedInUserObj)
            // console.log(contactsResult)
            // this.setState({ users: contactsResult.data })


        // Fetch Existing Chats from LocalStorage
        // let lsChats = JSON.parse(localStorage.getItem(this.props.loggedInUserObj._id + "_messages"))
        // this.setState({ chats: { ...lsChats } })

        // Web Socket Connection
        // let ws = new WebSocket(`http://localhost:8080`)
        // console.log("New Web Socket Connection: ", ws);

        // ws.onopen = () => {
        //     console.log("Connected Websocket main component.");
        //     this.setState({ ws: ws });
        // }

        // ws.onmessage = async (e) => {
        //     let newMessage = JSON.parse(e.data)
        //     // In case message is from self, save state-stored message to Chats i.e. no need of using/decrypting the received message
        //     // This is only for verifying that the messages have successfully been received.
        //     if (newMessage.senderid === this.props.loggedInUserObj._id) {
        //         newMessage.message = this.state.lastSentMessage
        //     } else { // Otherwise decrypt it and then save to Chats
        //         // Decryption using Signal Protocol
                // let decrytedMessage = await this.props.signalProtocolManagerUser.decryptMessageAsync(newMessage.senderid, newMessage.message)
        //         newMessage.message = decrytedMessage
        //     }

        //     // Update message data to Chats & LocalStorage -> 2 Scenarios
        //     // 1. If the Chat already exists
        //     if (newMessage.chatId in this.state.chats) {
        //         this.setState(prevState => ({
        //             chats: {
        //                 ...prevState.chats, [newMessage.chatId]: {
        //                     ...prevState.chats[newMessage.chatId],
        //                     messages: [...prevState.chats[newMessage.chatId].messages.concat(newMessage)]
        //                 }
        //             }
        //         }), () => localStorage.setItem(this.props.loggedInUserObj._id + "_messages", JSON.stringify(this.state.chats)))
        //     }
        //     // 2. In case the Chat does not exist, Create New Chat
        //     else {
        //         let newChat = {
        //             chatId: newMessage.chatId,
        //             members: [newMessage.senderid, newMessage.receiverid],
        //             messages: []
        //         }
        //         newChat.messages.push(newMessage)
        //         this.setState(prevState => ({
        //             chats: { ...prevState.chats, [newMessage.chatId]: newChat }
        //         }), () => localStorage.setItem(this.props.loggedInUserObj._id + "_messages", JSON.stringify(this.state.chats)))
        //     }
        // }

        // ws.onclose = () => {
        //     console.log("Disconnected Websocket main component.");
        //     // redirect to login
        // }I am pursuing B.E at L.D college of engineering. I am interested in java backend development and cloud-native application backend development, I completed four-five personal project which is based on Spring framework and cloud-computing.
// I choose spring frame-work because of its production-ready application and deployment of spring application on ec2 instance or Elastibean stalk it so easily can achieve.  I also experience with lambda serverless technology File processing Application completed using it.  GitHub Link: https://github.com/jainnneel?tab=repositories