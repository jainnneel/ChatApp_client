import React, { useState, useEffect } from 'react'
import './Chat.css'
import { MdAccountCircle, MdNotifications, MdSettings,MdExitToApp,MdGroupAdd } from "react-icons/md";
import img from '../../images/download.jpg'
import Modal from 'react-modal';
import { useHistory } from 'react-router';
import Notify from '../chatWindow/Notify'
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios'
import SockJsClient from "react-stomp"
import { IoPersonAddSharp } from "react-icons/io5";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import {ip} from '../ipvalue'
function Profile(props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isContact, setIsContact] = useState(false);
    const [isNoti, setIsNoti] = useState(false);
    const [user, setUser] = useState(props.curuser);
    const [adduser,setAdduser] = useState({});
    const [notifications,setnotifications] = useState([]);
    const [clientRef,setclientRef] = useState({})
    const [groupmodel,setGroupModel] = useState(false)
    const [groupinfo,setGroupInfo] = useState({})
    const history = useHistory();
    const ipaddr =`http://${ip}/chat`;
    useEffect(() => {
        // getNotifications();
        setUser(props.curuser)
        console.log(props.curuser)
    }, []);
    const [record, setrecord] = useState([]);

    const getNotifications = () => {
        // let contactDetails = null;
        try {
            axios.defaults.headers = {
                Authorization: `Bearer ` + localStorage.getItem('token')
            }
            axios.post(`http://${ip}/getNotification`, JSON.stringify(props.curuser.mobile)).then(
                (response) => {
                    setnotifications(response.data.data)
                },
                (Error) => {
                    console.log(Error);
                }
            )

        } catch (error) {
            console.log("error:", error);
        }
    }

    const readNotification  = async (msg) =>{
       try {
           let data = {
            fromMobile:props.curuser.mobile
           }
        //    console.log(data)
        clientRef.sendMessage("/app/chat/readMessageNoti", JSON.stringify(data));
        }catch (error) {
            console.log("error:", error);
        }
    }   

    const getuser = () => {
        props.getusers()
    }

    const deleteNotification = (nid) => {
        console.log(nid)
        try {
            axios.defaults.headers = {
                Authorization: `Bearer ` + localStorage.getItem('token')
            }
            axios.post(`http://${ip}/deleteNotification`, JSON.stringify(nid)).then(
                (response) => {
                    getNotifications();
                },
                (Error) => {
                    console.log(Error);
                }
            )

        } catch (error) {
            console.log("error:", error);
        }

    }

    const acceptRequest = (nid) => {
        console.log(nid)
        try {
            axios.defaults.headers = {
                Authorization: `Bearer ` + localStorage.getItem('token')
            }
            axios.post(`http://${ip}/addUseToContact`, JSON.stringify(nid)).then(
                (response) => {
                    getNotifications();
                    console.log(response.data.data)
                    props.addUserToList()
                },
                (Error) => {
                    console.log(Error);
                }
            )

        } catch (error) {
            console.log("error:", error);
        }
    }

    const customStyle = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            //   marginRight           : '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#303030',
            width:'30vw',
            height:"40vh",
            overflow:"scroll"

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
            width:'40vw',
            height:"50vh",
            overflow:"scroll"

        }
    };

    const openContactModel = () => {
        setIsOpen(true);
        setIsContact(true);
    }

    const logout = () => {
        localStorage.removeItem('token');
        history.push('/login');

    }

    const openNotiModal = () => {
        document.getElementById('notiornot').classList.add('hide')
        getNotifications();
        readNotification();
        setIsOpen(true);
        setIsNoti(true);
    }

    const addusertolist = (e) => {
        e.preventDefault()
     try{
        axios.defaults.headers={
            Authorization:`Bearer `+localStorage.getItem('token')
        }
        
       axios.post(`http://${ip}/adduser`,JSON.stringify(adduser)).then(
           (response) => {
            //    debugger;
                console.log(response.data);
                if(response.data.status === "done"){
                    toast('request has been send successfully',{ position: toast.POSITION.TOP_CENTER })
                }else if(response.data.status === "not exists"){
                    toast('Number is invalid',{ position: toast.POSITION.TOP_CENTER })
                }else if(response.data.status === "alreadyAdded"){
                    toast('Already added',{ position: toast.POSITION.TOP_CENTER })
                }
                setAdduser(null)
                setIsOpen(false)
            },
           (Error) => {
               console.log(Error);
               setAdduser(null)
           }
       )
        
    } catch (error) {
        setAdduser(null)
        console.log("error:", error);
    }
    // this.setState({notify:false})
    }

    const onNotificationReceive = () => {
        // debugger;
        document.getElementById('notiornot').classList.remove('hide')
        // setIsNoti(true)
    }

    const openGroupModel = () => {
        console.log("fdsf")
        setGroupModel(true)
    }

    const createGroup = (e) =>{
        e.preventDefault();
        console.log(groupinfo.price === "0")
        // debugger
        setGroupInfo(groupinfo)
        if (groupinfo.price === "0" || groupinfo.price === undefined) {
            // debugger
            setGroupInfo({...groupinfo,freeOrNot:true})
        }else{
            setGroupInfo({...groupinfo,freeOrNot:false})
        }
        
        console.log(groupinfo)
        postDataToServer()
    }

    const postDataToServer = () => {
        
        console.log(groupinfo)
        axios.defaults.headers={
            Authorization:`Bearer `+localStorage.getItem('token')
        }
        
       axios.post(`http://${ip}/stock/group`,groupinfo).then(
           (response) => {
                console.log(response.data)
                toast('Group Is Created',{ position: toast.POSITION.TOP_CENTER })
                props.addUserToList()
                setGroupModel(false)
                // setGroupInfo({});
            },
           (Error) => {
               console.log(Error);
           }
       )
    }

    return (
        <div className="profile">
            <div className="prof">
                <img src={img}>
                </img>
                <h1>
                    {user.name}
            </h1>
            </div>
            <div className="noti">
                <MdGroupAdd onClick={openGroupModel} color="white" size="2.1rem" cursor="pointer"></MdGroupAdd>
                <IoPersonAddSharp onClick={openContactModel} color="white" size="1.5rem" cursor="pointer"></IoPersonAddSharp>
                <MdNotifications  onClick={openNotiModal} color="white" size="1.5rem" cursor="pointer"></MdNotifications><p id="notiornot" className="hide" >*</p>
                <MdExitToApp onClick={logout} color="white" size="1.5rem" cursor="pointer"></MdExitToApp>
            </div>
            <Modal
                isOpen={isOpen}
                onRequestClose={() => {
                    setIsOpen(false);
                    setIsNoti(false);
                    setIsContact(false);
                }}
                style={customStyle}>
                {
                    isNoti ?
                        <div>
                            {   
                                notifications.length === 0 ?<h1 className="empty-noti" >No Notification yet</h1>: 
                                notifications.map(noti =>
                                    <Notify notify={noti} deleteNotification={deleteNotification} color="grey" acceptRequest={acceptRequest}></Notify>
                                )
                            }
                        </div>
                        :
                        <div className="modal">
                            <h1 className="heading-contact">Add contact</h1>
                            <div className="form-contact">
                                <label htmlFor=""></label>
                                <input type="number" id="mobile" name="mobile" onChange={(e) => setAdduser(e.target.value)} placeholder="Enter mobile number here..."></input>
                                <button onClick={addusertolist} className="btn-contact">Add</button>
                            </div>
                        </div>
                }
                
            </Modal>
            <Modal
                isOpen={groupmodel}
                onRequestClose={() => {
                    setGroupModel(false)
                }}
                style={customStyle1}>
                {
                    groupmodel ? 
                    <div className="modal">
                            <h1 className="heading-contact">Create Group</h1>
                            <div className="form-contact">
                                <label htmlFor=""></label>
                                <input type="text" id="name" name="name" onChange={(e) => setGroupInfo({...groupinfo,groupName:e.target.value})} placeholder="Enter Name here..."></input>
                                <input type="text" id="desc" name="desc" onChange={(e) => setGroupInfo({...groupinfo,desc:e.target.value})} placeholder="Enter Description here..."></input>
                                <input type="number" id="price" name="price" onChange={(e) => setGroupInfo({...groupinfo,price:e.target.value})} placeholder="Enter price here..."></input>
                                {/* <input type="radio" id="free" value="free" onChange={setGroupInfo({...groupinfo,freeOrNot:false})} >Free</input>
                                <input type="radio" id="free" value="notfree" onChange={setGroupInfo({...groupinfo,freeOrNot:false})} >Paid</input> */}
                                <button onClick={createGroup} className="btn-contact">Add</button>
                            </div>
                        </div>
                    :
                    <div></div>    
                }
                
            </Modal>
            <SockJsClient url={ipaddr} topics={["/topic/notimessages/"+user.mobile]}
                    onMessage={onNotificationReceive } 
                    ref={ (client) => { 
                        setclientRef(client)  
                    }  
                    }
                    onConnect={ () => { console.log("connected")}}
                    onDisconnect={ () => { console.log("disconnected") } }
                    debug={ false }/>
        </div>
    )
}

export default Profile
