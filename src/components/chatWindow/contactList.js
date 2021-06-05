import React, { Component } from 'react'
import axios from 'axios'
import SockJsClient from "react-stomp"
import Notification from './Notification'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();
export default class ContactList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: this.props.users, 
            contact:"",
            notification:false,
            ifnoti:false
        }
        this.adduser = this.adduser.bind(this)
        this.notify = this.notify.bind(this)
        this.setNotification = this.setNotification.bind(this)
        this.onMessageReceive = this.onMessageReceive.bind(this)
        this.sendMessage = this.sendMessage.bind(this)
        this.addUserToList = this.addUserToList.bind(this)
        this.getContacts = this.getContacts.bind(this)
        // this.setusers = this.setusers.bind(this)
        // this.onuseronline = this.onuseronline(this)
        this.getusers = this.getusers.bind(this)
        this.clientRef = null;        
        // this.notificationshow = this.notificationshow.bind(this)
    }   

    addUserToList(user){
       this.setState( prev => ({
           users : [...prev.users,user]
       }))
       console.log(this.state.users)
    }
      
       
       async  getusers(user){
           console.log(this.props.curuser.mobile)
            try {
                axios.defaults.headers={
                    Authorization:`Bearer `+localStorage.getItem('token')
                }
               axios.post(`http://localhost:8081/getAllUserAddedByUser`,this.props.curuser.mobile).then(
                   (response) => {
                       console.log(response.data);
                       this.setState({ users: response.data})
                       this.setState({ notification : false})
                   },
                   (Error) => {
                       console.log(Error);
                   }
               )
                
            } catch (error) {
                console.log("error:", error);
            }
        }

    

    async sendMessage(msg){
        // console.log(msg)
        // console.log(this.state.messageToUser.mobile)
       try {
           let data = {
            fromMobile:this.props.curuser.mobile
           }
        //    console.log(data)
        this.clientRef.sendMessage("/app/chat/readMessageNoti", JSON.stringify(data));
        }catch (error) {
            console.log("error:", error);
        }
    }   
    
    
    onMessageReceive = (msg, topic) => {
        console.log(JSON.stringify(msg)+'   '+topic)
        this.setState({ifnoti:true})
      }
      
    onaddeduser = (msg , topic) => {
        console.log(JSON.stringify(msg)+'   '+topic)
        this.setState( prev => ({
            users : [...prev.users,msg]
        }))
        console.log(this.state.users)
    } 
    onuseronline = (msg) => {
        // debugger
        if(msg.online === 'online'){
             document.getElementById('online_'+msg.mobile).classList.remove('hide'); 
        }else{
             document.getElementById('online_'+msg.mobile).classList.add('hide'); 
        }
        
     }
    componentDidMount(){
        
    }

    onofflinemessage = (msg) => {
        msg.map(usermobile => {
            document.getElementById('newmessage_'+usermobile).classList.remove('hide'); 
        })
    }
    
    

    setNotification(){
        // console.log('dasda')
        this.setState({ifnoti:false})
        // console.log(this.state.notification) 
        // debugger;
        if(this.state.notification === false){
            this.setState({notification:true}) 
        } else{
            this.setState({notification:false})  
        }
        this.sendMessage() 
    }

  

    notify(msg){
        // debugger;
        toast(msg,{ position: toast.POSITION.TOP_CENTER })
    }

    adduser(e){
        e.preventDefault()
        console.log(this.state.contact)
     try{
        axios.defaults.headers={
            Authorization:`Bearer `+localStorage.getItem('token')
        }
        
       axios.post(`http://localhost:8081/adduser`,JSON.stringify(this.state.contact)).then(
           (response) => {
            //    debugger;
               console.log(response.data);
               if(response.data.status === "done"){
                      this.notify('request has been send successfully')
               }else if(response.data.status === "not exists"){
                     this.notify('Number is invalid')
               }else if(response.data.status === "alreadyAdded"){
                     this.notify('Already added')
               }
               
           },
           (Error) => {
               console.log(Error);
           }
       )
        
    } catch (error) {
        console.log("error:", error);
    }
    // this.setState({notify:false})
    this.toggleModal()
    }

    handleMessageText(e) {
        this.setState({ contact: e.target.value })
    }

    setSelectedUser(selectedUser) {
        
        let data = {
            fromMobile : selectedUser.mobile,
            toMobile :  this.props.curuser.mobile
        }

        this.clientRef.sendMessage("/app/chat/offlinemessage", JSON.stringify(data));
        this.clientRef.sendMessage("/app/chat/readMessage", JSON.stringify(data));
        this.props.selectedUser(selectedUser)
    }

    // Method to Update Last Message
    getLastMessage(userid) {
        for (let chat of Object.values(this.props.chats)) {
            if (chat.members.includes(userid)) {
                return "hiii"
            }
        }
    }

    getLastMessageDetails(user) {
        // let lastMessage = this.getLastMessage(user.id)
        let lastMessage = {};
        lastMessage.message = "hiii"
        lastMessage.date ="21/2/2021"
        // console.log(lastMessage)
        
        const lastMessageDetails = (
            <>
                <div className="grid w-full">
                    <div className="contact-name font-bold px-2">{user.name}</div>
                
                    {lastMessage ? <div className="last-message px-2 text-sm">{lastMessage.message}</div> : null}
                </div>
               
                {lastMessage ? <div className="last-message-time w-1/4 text-right">{lastMessage.date}</div> : null}
                
                <div className="last-message-time w-1/2 text-right hide" id = {"newmessage_"+user.mobile}>New</div>
                {
                    user.status === 'online' ? <div className="last-message-time w-1/2 text-right" id = {"online_"+user.mobile}>Online</div> : <div className="last-message-time w-1/2 text-right hide" id = {"online_"+user.mobile}>Online</div> 

                }
                
                
            </>
        )
        return lastMessageDetails
    }

    getContacts() {
        console.log(this.state.users)
        console.log(this.props.curuser.mobile)
        // debugger;
        // console.log(this.props.users)
        // 
        // this.getusers(null)
        console.log(this.state.users.length)
        if(this.state.users.length > 0){
            const contactDetails = this.state.users.map(user =>
                <div className="user flex mt-2 p-2 border-b " id={user.id} key={user.id} onClick={() => this.setSelectedUser(user)}>
                    <div className="w-1/4 rounded-full relative h-12 text-center">
                        <img className="profile-picture absolute h-full object-cover self-center" src="download.jpg" alt="dp" />
                    </div>
                    {this.getLastMessageDetails(user)}
    
                </div>
            )
            return (contactDetails)
        }else{
            const contactDetails = this.props.users.map(user =>
                <div className="user flex mt-2 p-2 border-b " id={user.id} key={user.id} onClick={() => this.setSelectedUser(user)}>
                    <div className="w-1/4 rounded-full relative h-12 text-center">
                        <img className="profile-picture absolute h-full object-cover self-center" src="download.jpg" alt="dp" />
                    </div>
                    {this.getLastMessageDetails(user)}
    
                </div>
            )
            return (contactDetails)
        }
        
        
    }
     toggleModal () {
        const body = document.querySelector('body')
        const modal = document.querySelector('.modal')
        modal.classList.toggle('opacity-0')
        modal.classList.toggle('pointer-events-none')
        body.classList.toggle('modal-active')
      }

    openmodal = (e) => {
        e.preventDefault()
    	this.toggleModal()
    }   
    

    render() {
        
        return (
            <>
            {/* {this.state.notify ? this.notify(this.state.message): null}  */}
            <div className="contact-box w-2/5 bg-gray-900 text-white rounded-l">
                <div className="flex mt-2">
                    <i onClick={this.setNotification} className="las la-bars p-2 ml-2 text-xl"></i>
                    
                    {this.state.notification ? <Notification color = "blue" addUserToList={this.addUserToList} getusers = {this.getusers} mobile = {this.props.curuser.mobile} /> : null}
                    {this.state.ifnoti ? `*` : null}
                    {/* <i className="search-bar las la-search p-2 text-xl"></i>
                    <input className="search-bar px-2 bg-gray-900 text-white w-full focus:outline-none focus:ring rounded" placeholder="Search here.."></input> */}
                    <i  onClick={this.openmodal} className="las la-ellipsis-v p-2 text-xl"></i>
                </div>
                <div>{this.props.curuser.mobile}   </div>
                <div>{this.props.curuser.name}</div>
                <div className="contact-list grid-cols-1 p-2">
                    {this.getContacts()}
                </div>
        {/* <div className="modal opacity-0 pointer-events-none z-0 md:z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center">
            <div  onClick={this.openmodal} className="modal absolute w-full h-full bg-gray-900 opacity-50"></div>        
            <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
                <div className="modal-content py-4 text-left px-6">
                    <div className="flex justify-between items-center pb-3">
                        <p className="text-2xl font-bold">Simple Modal!</p>
                        <div className="modal-close cursor-pointer z-50">
                            <svg 
                            onClick={this.openmodal}
                             className="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                            <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                            </svg>
                        </div>
                    </div>
                    <form action="" className="bg-white shadow-md rounded px-8 pt-8 pb-8 m-4">
                        <label className="block text-lg font-bold mb-4 py-2 text-center bg-gray-800 rounded text-white">Add Contact</label>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Mobile :</label>
                            <label className="incorrect-user text-red-500"></label>
                            <input value={this.state.msgText} onChange={(e) => this.handleMessageText(e)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="mobilenumber" type="text" placeholder="Enter user mobile number here..." />
                        </div>
                        <div className="flex justify-end pt-2">
                        <button onClick={ (e) => this.adduser(e)}  className="px-4 bg-transparent p-3 rounded-lg text-gray-500 hover:bg-indigo-100 hover:text-indigo-400 mr-2">Add user</button>
                        <button onClick={this.openmodal} className="modal-close px-4 bg-indigo-500 p-3 rounded-lg text-white hover:bg-indigo-400">Close</button>
                        </div>
                    </form>
                </div>
            </div>
        </div> */}
             </div>
                 <SockJsClient url="http://localhost:8081/chat" topics={["/topic/notimessages/"+this.props.curuser.mobile]}
                    onMessage={ this.onMessageReceive } 
                    ref={ (client) => { 
                        this.clientRef = client 
                    }  
                    }
                    onConnect={ () => { console.log("connected")}}
                    onDisconnect={ () => { console.log("disconnected") } }
                    debug={ false }/>
                 <SockJsClient url="http://localhost:8081/chat" topics={["/topic/addnewuser/"+this.props.curuser.mobile]}
                    onMessage={ this.onaddeduser } 
                    ref={ (client) => { 
                        this.clientRef = client 
                    }  
                    }
                    onConnect={ () => { console.log("connected3")}}
                    onDisconnect={ () => { console.log("disconnected") } }
                    debug={ false }/>

                    <SockJsClient url="http://localhost:8081/chat" topics={["/topic/status/"+this.props.curuser.mobile]}
                        onMessage={ this.onuseronline } 
                        ref={ (client) => { 
                            this.clientRef = client 
                        }  
                        }
                        onConnect={ () => { console.log("connected3")}}
                        onDisconnect={ () => { console.log("disconnected") } }
                        debug={ false }
                    />
                    <SockJsClient url="http://localhost:8081/chat" topics={["/topic/offlineMessage/"+this.props.curuser.mobile]}
                        onMessage={ this.onofflinemessage } 
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
