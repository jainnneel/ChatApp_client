import React, { Component } from 'react'
import moment from 'moment'
import Modal from './Modal'
import axios from 'axios'
import CryptoJS from "crypto-js";
import SockJsClient from "react-stomp"


export default class MessageBox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            msgText: "",
            chats:[]
        }
        this.setState({chats:this.props.messages})
        this.sendMessageToServer = this.sendMessageToServer.bind(this)
        this.deletemessage = this.deletemessage.bind(this)
        // this.onMessagedeletemessageReceive = this.onMessagedeletemessageReceive.bind(this)
    }

    handleMessageText(e) {
        this.setState({ msgText: e.target.value })
    }

    onreadMessages(msg){
        // debugger;
        msg.map(chat => {
            document.getElementById('status_'+chat.id).innerHTML = chat.seenOrNot
        })
    }

    sendMessageToServer() {
        
        if (this.state.msgText) { //to not send empty message
            let msgObj = {
                message: this.state.msgText,
                date: moment().format('LT')
            }
            this.props.setNewMsgObj(msgObj)
        }
        this.setState({ msgText: "" })
            let l = document.querySelector('.message-area').scrollHeight;
             document.querySelector('.message-area').scrollTop =  l;
           
    }
    deletemessage(e,chatid,mid){
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
                //    debugger;
                   if(response.data.status==="done"){
                    //    let chats = [...this.state.chats]
                    //    console.log(chats)
                    //    const chatup =  chats.filter(chat => 
                    //        chat.chatId !== mid
                    //    ) 
                    //    console.log(chatup)
                    //    this.setState({chats:chatup})
                    this.props.setmessages(mid);
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




    // Method to Display Messages
    addMessagesToChat() {
        // debugger;
        // console.log("add message called")
        // console.log(this.props.chats.length)
        if (this.state.chats !== undefined && this.state.chats !== null && this.state.chats.length>0    ) {
            // console.log(this.props.messages)
            const msgContent = this.state.chats.map(function (message,index) {
                // debugger;
                // console.log(message)
                let key = "12345678901234567890123456789012";
                key = CryptoJS.enc.Utf8.parse(key);
                let iv = "1234567890123456";
                iv = CryptoJS.enc.Utf8.parse(iv);
                let decrypted = CryptoJS.AES.decrypt(message.message, key, { iv: iv });
                // debugger;
                if (message.toUser === this.props.selectedUser.mobile)
                    return (<div key={index} id={"chatid_"+message.chatId} className="outgoing w-3/4 justify-end float-right flex my-2">
                        <button onClick={ (e) => this.deletemessage(e,index,message.chatId)}>delete</button>
                        <div id = {"status_"+message.chatId} > {message.seenOrNot} </div>
                        
                        <div className=" w-max bg-gray-200 text-black shadow-lg clear-both p-2 rounded-md">
                            {decrypted.toString(CryptoJS.enc.Utf8)}</div>
                        <div> {message.date} </div>    
                        {/* <div className="w-16 rounded-full relative h-16 mx-2 px-2">
                            <img className="profile-picture absolute h-full object-cover self-center p-2" src={"/images/" + this.props.loggedInUserDP} alt="dp" />
                        </div> */}
                    </div>)
                else
                    return (<div key={index} id={"chatid_"+message.chatId} className="incoming w-3/4 flex my-2">
                        {/* <div className="w-16 rounded-full relative h-16 mx-2 px-2">
                            <img className="profile-picture absolute h-full object-cover self-center p-2" src={"/images/" + this.props.selectedUser.img} alt="dp" />
                        </div> */}
                        <div className=" w-max bg-gray-900 text-white shadow-lg clear-both p-2 rounded-md">
                            {decrypted.toString(CryptoJS.enc.Utf8)}</div>
                            <div> {message.date} </div> 
                        {/* <button onClick={ (e) => this.deletemessage(e,message.chatId)}>delete</button>     */}
                    </div>)
            }.bind(this))
            return (msgContent)
        }else{
            console.log('fdsfs');
            const msgContent = this.props.messages.map(function (message,index) {
                let key = "12345678901234567890123456789012";
                key = CryptoJS.enc.Utf8.parse(key);
                let iv = "1234567890123456";
                iv = CryptoJS.enc.Utf8.parse(iv);
                let decrypted = CryptoJS.AES.decrypt(message.message, key, { iv: iv });
                // debugger;
                // console.log(message)
                if (message.toUser === this.props.selectedUser.mobile)
                    return (<div key={index} id={"chatid_"+message.chatId} className="outgoing w-3/4 justify-end float-right flex my-2">
                        <button onClick={ (e) => this.deletemessage(e,index,message.chatId)}>delete</button>
                        <div id = {"status_"+message.chatId} > {message.seenOrNot} </div>
                        <div className=" w-max bg-gray-200 text-black shadow-lg clear-both p-2 rounded-md">
                            {decrypted.toString(CryptoJS.enc.Utf8)}</div>
                            <div> {message.date} </div> 
                        {/* <div className="w-16 rounded-full relative h-16 mx-2 px-2">
                            <img className="profile-picture absolute h-full object-cover self-center p-2" src={"/images/" + this.props.loggedInUserDP} alt="dp" />
                        </div> */}
                    </div>)
                else
                    return (<div key={index} id={"chatid_"+message.chatId} className="incoming w-3/4 flex my-2">
                        {/* <div className="w-16 rounded-full relative h-16 mx-2 px-2">
                            <img className="profile-picture absolute h-full object-cover self-center p-2" src={"/images/" + this.props.selectedUser.img} alt="dp" />
                        </div> */}
                        <div className=" w-max bg-gray-900 text-white shadow-lg clear-both p-2 rounded-md">
                            {decrypted.toString(CryptoJS.enc.Utf8)}</div>
                            <div> {message.date} </div> 
                        {/* <button onClick={ (e) => this.deletemessage(e,message.chatId)}>delete</button>     */}
                    </div>)
            }.bind(this))
            return (msgContent)
        }
    }

    setmessages(mid){
        this.setState({
            chats: this.props.messages
        })
        console.log(this.state.chats)
        
        this.setState({
            chats: this.state.chats.filter(chat => 
                    chat.chatId !== mid
            ) 
        })
        console.log(this.state.chats)
    }

    onMessagedeletemessageReceive = (msg) => {
        // debugger
        console.log(msg)
        if(msg.fromMobile === this.props.selectedUser.mobile){
            document.getElementById('chatid_'+msg.id).classList.add('hide')
        }
    }

    render() {
        return (
            <>
            <div className="message-box w-3/5">
                <div className=" w-full relative h-full grid grid-flow-rows">
                    {/* Contact Options Bar */}
                    {/* {<Modal></Modal>} */}
                    <div className="user-bar flex w-full py-4 absolute inset-x-0 top-0 shadow-lg">
                        <div className="w-12 rounded-full relative h-12 text-center mx-2">
                            <img className="profile-picture absolute h-full object-cover self-center p-2" src={"/images/" + this.props.selectedUser.img} alt="dp" />
                        </div>
                        <div className="contact-name font-bold w-3/4 float-left py-2">{this.props.selectedUser.name}</div>
                        <div className="icons w-1/4 text-right mr-4">
                            <i className="fas fa-video p-2 text-l"></i>
                            <i className="fa fa-phone p-2 text-l"></i>
                            <i className="fa fa-ellipsis-v p-2 text-l"></i>
                        </div>
                    </div>
                    {/* Messages Area */}
                    <div className="message-area clearfix overflow-auto my-20 p-2">
                        {this.addMessagesToChat()}
                    </div>
                    {/* Input Box and other Options */}
                    <div className="input-box flex p-4 bottom-0 absolute inset-x-0 bg-white shadow-inner">
                        <input className="msg-input p-2 w-4/5 float-left text-sm focus:outline-none focus:ring" placeholder="Write Message.."
                            value={this.state.msgText} onChange={(e) => this.handleMessageText(e)}>
                        </input>
                        <div className="icons py-2 w-1/5 text-center flex">
                            <i className="las la-grin p-2 text-xl"></i>
                            <i className="las la-paperclip p-2 text-xl"></i>
                            <i className="las la-image p-2 text-xl"></i>
                        </div>
                        <div className="bar text-gray-300 text-4xl px-4">|</div>
                        <button className="rounded-full focus:outline-none place-self-center transform hover:scale-110 motion-reduce:transform-none" onClick={() => this.sendMessageToServer()}>
                            <i className="lar la-paper-plane m-4 text-xl mx-4"></i>
                        </button>
                    </div>
                </div>
            </div>
            <SockJsClient url="http://localhost:8081/chat" topics={["/topic/deletemessages/"+this.props.curuser.mobile]}
            onMessage={ this.onMessagedeletemessageReceive } 
            ref={ (client) => {     
                this.clientRef = client 
            }  
            }
            onConnect={() => { console.log("connect") } }
            onDisconnect={ () => { console.log("disconnected") } }
            debug={ false }/>
            <SockJsClient url="http://localhost:8081/chat" topics={["/topic/readMessages/"+this.props.curuser.mobile]}
                        onMessage={ this.onreadMessages } 
                        ref={ (client) => { 
                            this.clientRef = client 
                        }  
                        }
                        onConnect={ () => { console.log("connected3")}}
                        onDisconnect={ () => { console.log("disconnected") } }
                        debug={ false }
            /> 
                   
         </>   
        )
    }
}
