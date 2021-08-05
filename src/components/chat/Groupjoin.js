import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Redirect, useHistory } from 'react-router-dom'
import Modal from 'react-modal';
import img from '../../images/download.jpg'
import {ip} from '../ipvalue'

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = src
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script)
    })
}

const initialValue = {
    orderId: "",
    paymentId: ""
};

const Groupjoin = () => {
    const history = useHistory();
    const { id } = useParams();
    const [isFree, setFree] = useState(false)
    const [isNotFree, setNotFree] = useState(false)
    const [group, setGroup] = useState({})
    const [infoShow, setShow] = useState(false)
    const ipaddr =`http://${ip}/chat`;
    useEffect(() => {

        if (localStorage.getItem('token') === undefined || localStorage.getItem('token') === null) {
            history.push("/login");
        } else {
            console.log('dsadsa')
            try {
                axios.defaults.headers = {
                    Authorization: `Bearer ` + localStorage.getItem('token')
                }
                axios.get(`http://${ip}/stock/isusermember/`+ id).then((res) => {
                    // debugger;    
                    console.log(res.data.data)

                    if (res.data.data.arr[0]) {
                        alert('Group Not Exists')
                    } else {
                        if (res.data.data.arr[1]) {
                            alert('You are already member')
                        } else {
                            setGroup(res.data.data.group)
                            if (res.data.data.group.freeOrNot) {
                                setFree(true)
                            } else {
                                setNotFree(true)
                            }
                            setShow(true)
                        }
                    }
                })
            } catch (error) {
                console.log("error:", error);
            }
        }
    }, [])
    const customStyle = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            //   marginRight           : '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#303030',
            width: '30vw',
            height: "45vh",
            overflow: "scroll"

        }
    };

    const joingroup = () => {
        try {
            axios.defaults.headers = {
                Authorization: `Bearer ` + localStorage.getItem('token')
            }
            let joinreq = {
                groupId: id
            }
            axios.post(`http://${ip}/stock/joingroup`, joinreq).then((res) => {
                console.log(res.data.data)
                history.push({ pathname: '/' })
            })
        } catch (error) {
            console.log("error:", error);
        }
    }

    const joingroupwithpayment = () => {
        console.log(group)
        // debugger
        if(group.freeOrNot){
            joingroup()
            return;
        }


        try {
            axios.defaults.headers = {
                Authorization: `Bearer ` + localStorage.getItem('token')
            }
            let joinreq = {
                groupId: id
            }
            axios.post(`http://${ip}/stock/joingroup`, joinreq).then((res) => {
                console.log(res.data.data)
                displayRazorpay(res.data.data)
            })
        } catch (error) {
            console.log("error:", error);
        }
    }

    const displayRazorpay = async (data) => {
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

        if (!res) {
            alert("Oops! something went wrong");
            return
        }

        const options = {
            key: 'rzp_test_9B8AXwdinhrVTx',
            currency: "INR",
            amount: group.price,
            order_id: data.orderId,
            name: group.groupName,
            description: 'Pay your amount here.',
            image: '../../images/download.jpg',
            handler: function (response) {
                console.log(response.razorpay_order_id);
                console.log(response.razorpay_payment_id);
                console.log(response.razorpay_signature);
                initialValue.orderId = response.razorpay_order_id;
                initialValue.paymentId = response.razorpay_payment_id;
                // setValues({...values,orderId : response.razorpay_order_id,paymentId : response.razorpay_payment_id})
                axios.post(`http://${ip}/stock/payment`, initialValue)
                    .then((resp) => {
                        if (resp.data.data !== "added") {
                            alert('Try Again..')
                        }
                        else {
                            history.push({ pathname: '/' })
                        }
                    }).catch((err) => {
                        console.log(err);
                    })

            },
        }
        const paymentObject = new window.Razorpay(options)
        paymentObject.open()

    }

    return (
        <>
            {
                Object.keys(group).length > 0 ?
                    <Modal
                        isOpen={infoShow}
                        closeTimeoutMS={500}
                        onRequestClose={() => {
                            setShow(false)
                        }}
                        style={customStyle}>
                        <div className="groupModel" >
                            <div className="grouptitlemodel">
                                <img src={img}></img>
                                <div className="groupInfo" >
                                    <p className="groupname">{group.groupName}</p>
                                    <p className="groupdesc" >{group.groupDescription}</p>
                                    <div className="groupmem">
                                        <p>{group.groupMembers.length} members</p>
                                        {/* <p>{group.freeOrNot ? 'Free' : 'Paid'} </p> */}
                                        {
                                            group.freeOrNot ? 'Free' :
                                                <>
                                                    <p> Price : Rs. {group.price}   </p>
                                                </>
                                        }
                                    </div>
                                    <div>
                                        <button onClick={() => joingroupwithpayment()} className="btn-join1" > Accept </button>
                                    </div>
                                </div>
                            </div>
                            <div className="admininfo" >
                                <h1>For Queries</h1>
                                <p>Name: {group.adminUser.name}</p>
                                <p>Mobile: {group.adminUser.mobile} </p>
                            </div>
                        </div>
                    </Modal> : ''
            }

        </>
    )
}

export default Groupjoin