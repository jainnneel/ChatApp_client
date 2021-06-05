import React, { useState,useEffect } from 'react';


const ContactlistE2ee  = (props) => {

    const [users,setusers] = useState(props.users); 

    useEffect(()=>{
        // setusers(props.users);
        console.log(users)
    },[]);

    const setSelectedUser = (user) => {
        props.selectedUser(user)
    }

    const getLastMessageDetails = (user) => {
        
        const lastMessageDetails = (
            <>
                <div className="grid w-full">
                    <div className="contact-name font-bold px-2">{user.name}</div>
                </div>
            </>
        )
        return lastMessageDetails
    }

    const getContacts = () => {
        if(users.length > 0){
            const contactDetails = users.map(user =>
                <div className="user flex mt-2 p-2 border-b " id={user.id} key={user.id} onClick={() => setSelectedUser(user)}>
                    <div className="w-1/4 rounded-full relative h-12 text-center">
                        <img className="profile-picture absolute h-full object-cover self-center" src="download.jpg" alt="dp" />
                    </div>
                    {getLastMessageDetails(user)}
                </div>
            )
            return (contactDetails)
        }
    }

    return(

        <>
         <div className="contact-box w-2/5 bg-gray-900 text-white rounded-l">
                <div>{props.curuser.mobile}   </div>
                <div>{props.curuser.name}</div>
                <div className="contact-list grid-cols-1 p-2">
                    {getContacts()}
                </div>
             </div>
        </>

    )
}

export default ContactlistE2ee;