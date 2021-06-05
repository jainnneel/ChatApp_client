// import { amber } from '@material-ui/core/colors';
import React, { useState,useEffect } from 'react';
import { createPopper } from "@popperjs/core";
import axios from 'axios'
import Notify from './Notify'
// import {remove,pic} from './images'

const Notification = (props) => {
    useEffect(()=>{
        getNotifications();  
        console.log(props) 
    },[]);
        const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(true);
        const btnDropdownRef = React.createRef();
        const popoverDropdownRef = React.createRef();
        const [record,setrecord] = useState([]); 
        const openDropdownPopover = () => {
          createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
            placement: "bottom-start"
          });
          setDropdownPopoverShow(true);
        };
        const closeDropdownPopover = () => {
          setDropdownPopoverShow(false);
        };
        // bgprops.colors
        let bgColor;
        props.color === "white"
          ? (bgColor = "bg-blueGray-700")
          : (bgColor = "bg-gray-500");

        const  getNotifications = () => {
            // let contactDetails = null;
            try {
                axios.defaults.headers={
                    Authorization:`Bearer `+localStorage.getItem('token')
                }
               axios.post(`http://localhost:8081/getNotification`,JSON.stringify(props.mobile)).then(
                   (response) => {
                       setrecord(response.data.data)
                   },
                   (Error) => {
                       console.log(Error);
                   }
               )
                
            } catch (error) {
                console.log("error:", error);
            }
        }
        
        const getuser = () => {
            props.getusers()
        }

        const deleteNotification = (nid) => {
            console.log(nid)
            try {
                axios.defaults.headers={
                    Authorization:`Bearer `+localStorage.getItem('token')
                }
               axios.post(`http://localhost:8081/deleteNotification`,JSON.stringify(nid)).then(
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
                axios.defaults.headers={
                    Authorization:`Bearer `+localStorage.getItem('token')
                }
               axios.post(`http://localhost:8081/addUseToContact`,JSON.stringify(nid)).then(
                   (response) => {
                       getNotifications();
                       console.log(response.data.data)
                       props.addUserToList(response.data.data)
                   },
                   (Error) => {
                       console.log(Error);
                   }
               )
                
            } catch (error) {
                console.log("error:", error);
            }
        }

        return (
          <>
            <div className="overlay z-10 flex flex-wrap">
              <div className="w-full sm:w-6/12 md:w-4/12 px-4">
                <div className="relative inline-flex align-middle w-full">
                  {/* <button
                    className={
                      "text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 " +
                      bgColor
                    }
                    type="button"
                    ref={btnDropdownRef}
                    onClick={() => {
                      dropdownPopoverShow
                        ? closeDropdownPopover()
                        : openDropdownPopover();
                    }}
                  >
                    {props.color === "white" ? "White Dropdown" :props.color + " Dropdown"}
                  </button> */}
                  <div
                    ref={popoverDropdownRef}
                    className={
                      (dropdownPopoverShow ? "block " : "hidden ") +
                      (props.color === "white" ? "bg-white " : bgColor + " ") +
                      "text-base z-50 float-left py-2 list-none text-left rounded shadow-lg mt-1"
                    }
                    style={{ minWidth: "12rem" }}
                  >
                    <a
                      href="#pablo"
                      className={
                        "font-black	tracking-wider text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent " +
                        (props.color === "blacke" ? " text-blueGray-700" : "text-black")
                      }
                      onClick={e => e.preventDefault()}
                    >
                      Notification
                    </a>
                     { 
                      record.map(noti => 
                        <Notify  getuser={getuser} notify = {noti} deleteNotification = {deleteNotification} color="grey" acceptRequest={acceptRequest}></Notify>
                      )
                    }
                    <div  className={
                        "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent " +
                        (props.color === "white" ? " text-blueGray-700" : "text-white")
                      }>
                        neel jain  
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

}

export default Notification;