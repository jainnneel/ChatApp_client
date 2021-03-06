import React,{useEffect,useState} from 'react'
import Contact from './Contact'
import SockJsClient from "react-stomp"
import {ip} from '../ipvalue'
const arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]

function ContactList(props) {

    const [clientRef,setclientRef] = useState({});
    const [ifnoti,setifnoti] = useState({});
    const [users,setusers] = useState(props.users);
    const ipaddr =`http://${ip}/chat`;
    const selectuser = (user) => {
        console.log(user.user)
        if(user.isuser){
            let data = {
                fromMobile : user.user.mobile,
                toMobile :   props.curuser.mobile
            }
            clientRef.sendMessage("/app/chat/offlinemessage", JSON.stringify(data));
            clientRef.sendMessage("/app/chat/readMessage", JSON.stringify(data));
            props.selectedUser(user.user)
        }else{
            props.selectedGroup(user.user)
        }

        
    }   

    const onaddeduser = (msg , topic) => {
        console.log(JSON.stringify(msg)+'   '+topic)
        props.addUserToList()
        console.log(users)
    } 

    const onuseronline = (msg) => {
        // debugger
        // if(msg.online === 'online'){
        //     document.getElementById('online_'+msg.mobile).classList.remove('hide'); 
        // }else{
        //     document.getElementById('online_'+msg.mobile).classList.add('hide'); 
        // }
     }

    const onofflinemessage = (msg) => {
        // debugger
        msg.map(usermobile => {
            document.getElementById('newmessage_'+usermobile).classList.remove('hide'); 
        })
    }

    return (
        <>
            <div className="list-contact">
                {
                    props.users.entities.map((user)=>{
                        return(
                            <Contact
                                isuser = {true} 
                                user = {user}
                                curuser = {props.curuser} 
                                key={user.mobile}
                                selectusers = {selectuser}
                                addUserToList = {props.addUserToList}
                            ></Contact>
                            )
                    })
                    
                }{
                    props.users.marketGroups.map((user)=>{
                        return(
                            <Contact
                                isuser = {false}  
                                user = {user}
                                curuser = {props.curuser} 
                                key={user.mobile}
                                selectusers = {selectuser}
                                addUserToList = {props.addUserToList}
                            ></Contact>
                            )
                    })
                }
            </div>
                 <SockJsClient url={ipaddr} topics={["/topic/addnewuser/"+props.curuser.mobile]}
                    onMessage={ onaddeduser } 
                    ref={ (client) => { 
                        setclientRef(client) 
                    }  
                    }
                    onConnect={ () => { console.log("connected3")}}
                    onDisconnect={ () => { console.log("disconnected") } }
                    debug={ false }/>
                <SockJsClient url={ipaddr} topics={["/topic/offlineMessage/"+props.curuser.mobile]}
                        onMessage={ onofflinemessage } 
                        ref={ (client) => { 
                            setclientRef(client) 
                        }  
                        }
                        onConnect={ () => { console.log("connected3")}}
                        onDisconnect={ () => { console.log("disconnected") } }
                        debug={ false }
                    /> 
                <SockJsClient url={ipaddr} topics={["/topic/status/"+props.curuser.mobile]}
                        onMessage={ onuseronline } 
                        ref={ (client) => { 
                            setclientRef(client) 
                        }   
                        }
                        onConnect={ () => { console.log("connected3")}}
                        onDisconnect={ () => { console.log("disconnected") } }
                        debug={ false }
                    />       
        </>    
    ) 
}

export default ContactList
