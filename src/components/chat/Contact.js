import React, { useEffect, useState } from 'react'
import img from '../../images/download.jpg'
import SockJsClient from "react-stomp"
import {ip} from '../ipvalue'
function Contact(props) {

    const [clientRef, setclientRef] = useState({});
    const ipaddr =`http://${ip}/chat`;
    const onuseronline = (msg) => {
        props.addUserToList()
        //     if(msg.online === 'online'){
        //         document.getElementById('online_'+msg.mobile).classList.remove('hide'); 
        //         document.getElementById('lastseen_'+msg.mobile).classList.add('hide'); 
        //    }else{
        //         document.getElementById('online_'+msg.mobile).classList.add('hide'); 
        //         document.getElementById('lastseen_'+msg.mobile).classList.remove('hide'); 
        //    } 
    }

    return (
        <>
            {
                props.isuser ?
                    <div className="contact" onClick={(e) => props.selectusers(props)} >
                        <div className="contact-in" >
                            <img src={img}>
                            </img>
                            <div className="name-chat">
                                <h1>
                                    {props.user.name}
                                </h1>
                                {/* <p className="hide" id = {'lastseen_'+props.user.mobile}>{ props.user.status !== 'online'  && 'props.user.lastseen' }</p> */}
                            </div>
                        </div>

                        <div className="time" className="hide" id={'lastseen_' + props.user.mobile}>{props.user.lastseen}</div>
                        {props.user.status === 'online' ? <div className="online" id={'online_' + props.user.mobile}>Online</div> : <> <div className="hide" id={"online_" + props.user.mobile}>Online</div> <div className="time" id={'lastseen_' + props.user.mobile}> {props.user.lastseen}</div> </>}
                        <p id={'newmessage_' + props.user.mobile} className="hide newmeesage" >New Message</p>
                    </div>
                    :
                    <div className="contact" onClick={(e) => props.selectusers(props)} >
                        <div className="contact-in" >
                            <img src={img}></img>
                            <div className="name-chat">
                                <h1>
                                    {props.user.groupName}
                                </h1>
                            </div>
                            <p id={'newmessage_' + props.user.groupId} className="hide newmeesage" >New Message</p>
                        </div>
                    </div>

            }
            <SockJsClient url={ipaddr} topics={["/topic/status/" + props.curuser.mobile]}
                onMessage={onuseronline}
                ref={(client) => {
                    setclientRef(client)
                }
                }
                onConnect={() => { console.log("connected3") }}
                onDisconnect={() => { console.log("disconnected") }}
                debug={false}
            />
        </>
    )
}

export default Contact
