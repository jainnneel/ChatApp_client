import React, { useState,useEffect } from 'react';
import remove from '../../images/remove.png'
import './Notify.css'

const Notify = (props) => {
    useEffect(()=>{
        console.log(props)
    },[]);

   if(props.notify.type === "req"){
    //    debugger
        return(
            <>
                <div id={props.notify.nid} className="notify-request" >
                    <h2 className="noti-msg-request">
                    {props.notify.message}
                    </h2>
                    <div className="for-btn">

                <button onClick={() => props.acceptRequest(props.notify.fromMobile)} className="btn-accpet" >
                    Accept
                    </button>
                <button onClick={() => props.deleteNotification(props.notify.nid)} className="btn-reqdlt">
                    Reject
                </button> 
                    </div>
                </div>
                {/* <hr></hr> */}
            </>
        )
   }else{
        // props.getuser();
        return(
        <>
            <div id={props.notify.nid} className="notify-request">
                <h2 className="noti-msg-request">
                {props.notify.message}
                </h2>
                <button onClick={() =>  props.deleteNotification(props.notify.nid)} className="btn-reqdlt">
                    Cancel
                </button>  
            {/* <img  onClick={() => props.deleteNotification(props.notify.nid)} src={remove} alt=""></img>*/}
            </div> 
        </>
    )
   } 

    


}

export default Notify;