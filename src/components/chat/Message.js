import React, { useState, useEffect } from 'react'
import { MdVideocam, MdCall, MdMoreVert, MdSend, MdDelete, MdCheck, MdDoneAll, MdLink, MdDeleteForever } from 'react-icons/md'
import { FiUsers } from "react-icons/fi";
import { AiOutlineUsergroupDelete } from "react-icons/ai";
import { HiUserGroup } from "react-icons/hi";
import { FcInfo } from "react-icons/fc";
import { RiChatDeleteFill } from "react-icons/ri";
import Modal from 'react-modal';
import Profile from './Profile'
import './Chat.css'
import img from '../../images/download.jpg'
import axios from 'axios';
import SockJsClient from "react-stomp"
import CryptoJS from "crypto-js";
import ScrollableFeed from 'react-scrollable-feed'
import {ip} from '../ipvalue'

function Message(props) {

    const [clientRef, setclientRef] = useState({});
    const [message, setMessage] = useState('')
    const [readed, setAllRead] = useState(false)
    const [groupMember, setgroupMember] = useState([])
    const [openlist, setopenlist] = useState(false)
    const [admin, setadmin] = useState(false)
    const [userInfo, setuserInfo] = useState(false)
    const ipaddr =`http://${ip}/chat`;
    const customStyle = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            //   marginRight           : '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#303030',
            width: '40vw',
            height: "45vh",
            overflow: "scroll"

        }
    };

    const customStyle1 = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            //   marginRight           : '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#303030',
            width: '25vw',
            height: "80vh",
            overflow: "scroll"
        }
    };

    const customStyle2 = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            //   marginRight           : '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#303030',
            width: '25vw',
            height: "45vh",
            overflow: "scroll"

        }
    }

    useEffect(() => {
        // console.log(props.messages)
    })
    const deletemessage = (e, chatid, mid) => {
        e.preventDefault()
        console.log(chatid)
        e.stopPropagation();

        try {
            axios.defaults.headers = {
                Authorization: `Bearer ` + localStorage.getItem('token')
            }
            console.log(JSON.stringify(mid))
            axios.post(`http://${ip}/deleteuser`, JSON.stringify(mid)).then(
                (response) => {
                    console.log(response.data);
                    if (response.data.status === "done") {
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
        if (message !== '') {
            props.setNewMsgObj(message)
            document.getElementById('messagebox').value = ''
        }
        setMessage('')
    }

    const onMessagedeletemessageReceive = (msg) => {
        console.log(msg)
        // debugger
        if (msg.fromMobile === props.selectedUser.mobile) {
            document.getElementById('chatid_' + msg.id).innerHTML = ''
        }
    }

    const onreadMessages = (msg) => {
        props.setchatusers()
    }

    const generateLink = () => {
        alert(`http://localhost:3000/group/` + props.selectedGroup.groupId)
    }

    const showUserList = () => {
        try {
            axios.defaults.headers = {
                Authorization: `Bearer ` + localStorage.getItem('token')
            }
            axios.get(`http://${ip}/stock/getgroupmember/${props.selectedGroup.groupId}`).then(
                (response) => {
                    // console.log(response.data);
                    if (response.data.status === "success") {
                        setgroupMember(response.data.data)
                        setopenlist(true)
                        console.log(groupMember)
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

    const leftgroup = () => {
        if (window.confirm('Left from group.. Are you sure?')) {
            if (!props.selectedGroup.freeOrNot) {
                if (window.confirm('It is paid.. Are you sure?')) {
                    leftFromGroup();
                }
            } else {
                leftFromGroup();
            }
        }
    }

    const leftFromGroup = () => {
        try {
            axios.defaults.headers = {
                Authorization: `Bearer ` + localStorage.getItem('token')
            }
            console.log(props.selectedGroup.groupId)
            axios.get(`http://${ip}/stock/leavegroup/${props.selectedGroup.groupId}`).then(
                (response) => {
                    // console.log(response.data);
                    if (response.data.status === "success") {
                        props.chatopen(false)
                        props.setusersList1()
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

    const deleteGroup = () => {

        if (window.confirm('Delete group.. Are you sure?')) {
            console.log(props.selectedGroup.freeOrNot)
            if (!props.selectedGroup.freeOrNot) {

                if (props.selectedGroup.groupMembers.length == 1) {
                    if (window.confirm('It is paid.. Are you sure?')) {
                        deleteGroup1();
                    }
                } else {
                    alert('Group Contains paid member you have to inform them to leave then you can left delete')
                }
            } else {
                deleteGroup1();
            }
        }
    }

    const deleteGroup1 = () => {
        try {
            axios.defaults.headers = {
                Authorization: `Bearer ` + localStorage.getItem('token')
            }
            console.log(props.selectedGroup.groupId)
            axios.get(`http://${ip}/stock/deletegroup/${props.selectedGroup.groupId}`).then(
                (response) => {
                    // console.log(response.data);
                    if (response.data.status === "success") {
                        props.chatopen(false)
                        props.setusersList1()
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

    const adminInfo = () => {
        setadmin(true)
    }

    const userremove = () => {
        try {
            axios.defaults.headers = {
                Authorization: `Bearer ` + localStorage.getItem('token')
            }
            axios.post(`http://${ip}/removeuser/${props.selectedUser.id}`).then(
                (response) => {
                    // console.log(response.data);
                    if (response.data.status === "done") {
                        props.chatopen(false)
                        props.setusersList1()
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

    const userInfy = () => {
        setuserInfo(true)
    }

    return (
        <>
            <div className="message-box">
                {
                    props.isUser ?
                        <div className="profile-chat">
                            <div className="prof-chat">
                                <img src={img}>
                                </img>
                                <h1>
                                    {props.selectedUser.name}
                                </h1>
                            </div>
                            <div className="noti-chat">
                                {/* <MdVideocam color="white" size="1.5rem"></MdVideocam>
                                <MdCall color="white" size="1.5rem"></MdCall>
                                <MdMoreVert color="white" size="1.5rem"></MdMoreVert> */}
                                <RiChatDeleteFill onClick={userremove} color="white" size="1.5rem" cursor="pointer"></RiChatDeleteFill>
                                <FcInfo onClick={userInfy} color="white" size="1.5rem" cursor="pointer"></FcInfo>
                            </div>
                        </div> :
                        <div className="profile-chat">
                            <div className="prof-chat">
                                <img src={img}>
                                </img>
                                <h1>
                                    {props.selectedGroup.groupName}
                                </h1>
                            </div>
                            <div className="noti-chat">
                                <HiUserGroup onClick={showUserList} color="white" size="1.5rem" cursor="pointer"></HiUserGroup>
                                <MdLink onClick={generateLink} color="white" size="1.5rem" cursor="pointer"></MdLink>
                                {
                                    props.selectedGroup.adminUser.mobile === props.curuser.mobile ?
                                        <MdDeleteForever onClick={deleteGroup} size="1.5rem" color="white" cursor="pointer"></MdDeleteForever>
                                        :
                                        <AiOutlineUsergroupDelete onClick={leftgroup} color="white" size="1.5rem" cursor="pointer"></AiOutlineUsergroupDelete>

                                }
                                <FcInfo onClick={adminInfo} color="white" size="1.5rem" cursor="pointer"></FcInfo>
                            </div>
                        </div>
                }

                {
                    props.isUser ?
                        <div className="box-main">
                           {/* <ScrollableFeed> */}
                            {
                                props.messages.map((chat, index) => {
                                    // debugger
                                    console.log(readed)
                                    let key = "12345678901234567890123456789012";
                                    key = CryptoJS.enc.Utf8.parse(key);
                                    let iv = "1234567890123456";
                                    iv = CryptoJS.enc.Utf8.parse(iv);
                                    let decrypted = CryptoJS.AES.decrypt(chat.message, key, { iv: iv });
                                    return (
                                        <div key={chat.chatId} id={"chatid_" + chat.chatId} className="messages">
                                            <p className={`${props.selectedUser.mobile === chat.fromLogin ? "left" : "right"} message`}>
                                                {(props.selectedUser.mobile !== chat.fromLogin) ?
                                                    <MdDelete onClick={(e) => deletemessage(e, index, chat.chatId)} color="white" size="1.5rem"></MdDelete> : null}
                                                <p className={`${(props.selectedUser.mobile === chat.fromLogin) ? "left-color" : "right-color"} data`}><p>{decrypted.toString(CryptoJS.enc.Utf8)}</p>

                                                    {(props.selectedUser.mobile !== chat.fromLogin) ?
                                                        <div className="time ">
                                                            {chat.date}
                                                            {chat.seenOrNot === "seen" ? <MdDoneAll color="#00c9c8" size="1rem"></MdDoneAll> : <MdCheck color="white" size="1rem"></MdCheck>}
                                                        </div> :
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
                            {/* </ScrollableFeed> */}
                        </div>
                        :
                        <div className="box-main">
                            {/* <ScrollableFeed> */}
                            {

                                props.messages.map((chat, index) => {
                                    // debugger
                                    // console.log(chat)
                                    let key = "12345678901234567890123456789012";
                                    key = CryptoJS.enc.Utf8.parse(key);
                                    let iv = "1234567890123456";
                                    iv = CryptoJS.enc.Utf8.parse(iv);
                                    let decrypted = CryptoJS.AES.decrypt(chat.message, key, { iv: iv });
                                    return (
                                        <div key={chat.chatId} id={"chatid_" + chat.chatId} className="messages">
                                            <p className={`${props.curuser.mobile !== chat.fromLogin ? "left" : "right"} message`}>
                                                {(props.curuser.mobile === chat.fromLogin) ?
                                                    <MdDelete onClick={(e) => deletemessage(e, index, chat.chatId)} color="white" size="1.5rem"></MdDelete> : null}
                                                <p className={`${(props.curuser.mobile !== chat.fromLogin) ? "left-color" : "right-color"} data`}><p>{decrypted.toString(CryptoJS.enc.Utf8)}</p>
                                                    {(props.curuser.mobile !== chat.fromLogin) ?
                                                        <div className="time reciever">
                                                            {chat.date}
                                                        </div> :
                                                        <div className="reciever ">
                                                            {chat.date}
                                                        </div>
                                                    }
                                                </p>
                                            </p>
                                        </div>
                                    )
                                })
                            }
                            {/* </ScrollableFeed> */}
                        </div>

                }
                <div className="bottom-chat">
                    <input placeholder="Type message here..." id='messagebox' onChange={(e) => setMessage(e.target.value)} />
                    <button onClick={sendmessage} ><MdSend color="white" size="2rem"></MdSend></button>
                </div>

            </div>
            {
                Object.keys(props.selectedUser).length > 0 ?
                    <>
                        <Modal
                            isOpen={userInfo}
                            onRequestClose={() => {
                                setuserInfo(false)
                            }}
                            closeTimeoutMS={500}
                            style={customStyle2}>
                            <div className="userInfoModel" >
                                <img src={img}></img>
                                <p className="username" > {props.selectedUser.name}</p>
                                <p className="usermobile"> {props.selectedUser.mobile} </p>
                            </div>
                        </Modal>

                    </>
                    :
                    ''
            }
            {
                Object.keys(props.selectedGroup).length > 0 ?
                    <>
                        <Modal
                            isOpen={openlist}
                            onRequestClose={() => {
                                setopenlist(false)
                            }}
                            closeTimeoutMS={500}
                            style={customStyle1}>
                            <div className="userlistmodel">
                                <p className="titlemodeluser">  Group Members </p>
                                <div className="userlistmodel2" >
                                    {
                                        groupMember.map(user => {
                                            return (
                                                <div className="userinfolistmodel" key={user.id}>
                                                    <img src={img}></img>
                                                    <div className="userinfo2" >
                                                        <p className="username1">{user.name}</p>
                                                        <p className="mobile1">{user.mobile}</p>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div> 
                        </Modal>
                        <Modal
                            isOpen={admin}
                            closeTimeoutMS={500}
                            onRequestClose={() => {
                                setadmin(false)
                            }}
                            style={customStyle}>
                            <div className="groupModel" >
                                <div className="grouptitlemodel">
                                    <img src={img}></img>
                                    <div className="groupInfo" >
                                        <p className="groupname">{props.selectedGroup.groupName}</p>
                                        <p className="groupdesc" >{props.selectedGroup.groupDescription}</p>
                                        <div className="groupmem">
                                            <p>{props.selectedGroup.groupMembers.length} members</p>
                                            <p>{props.selectedGroup.freeOrNot ? 'Free' : 'Paid'} </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="admininfo" >
                                    <h1>For Queries</h1>
                                    <p>Name : {props.selectedGroup.adminUser.name}</p>
                                    <p>Mobile : {props.selectedGroup.adminUser.mobile} </p>
                                </div>
                            </div>
                        </Modal>
                    </> : ''
            }
            <SockJsClient url={ipaddr} topics={["/topic/readMessages/" + props.curuser.mobile]}
                onMessage={onreadMessages}
                ref={(client) => { setclientRef(client) }}
                onConnect={() => { console.log("connected3") }}
                onDisconnect={() => { console.log("disconnected") }}
                debug={false} />

            <SockJsClient url={ipaddr} topics={["/topic/deletemessages/" + props.curuser.mobile]}
                onMessage={onMessagedeletemessageReceive}
                ref={(client) => { setclientRef(client) }}
                onConnect={() => { console.log("connect") }}
                onDisconnect={() => { console.log("disconnected") }}
                debug={false} />
        </>
    )
}

export default Message
