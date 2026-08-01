import {useEffect,useRef,useState} from "react";
import {
    FaBell,
    FaCheckDouble,
    FaTrash
} from "react-icons/fa";

import {
    getNotifications,
    readNotification,
    readAllNotifications,
    deleteNotification
} from "../../api/notification";

import "./NotificationBell.css";

export default function NotificationBell(){

    const[notifications,setNotifications]=useState([]);
    const[open,setOpen]=useState(false);

    const ref=useRef();

    async function loadNotifications(){

        try{

            const{data}=await getNotifications();

            setNotifications(data);

        }catch(error){

            console.error(error);

        }

    }

    useEffect(()=>{

        loadNotifications();

        const interval=setInterval(loadNotifications,5000);

        return()=>clearInterval(interval);

    },[]);

    useEffect(()=>{

        function handleClickOutside(event){

            if(ref.current&&!ref.current.contains(event.target)){

                setOpen(false);

            }

        }

        document.addEventListener("mousedown",handleClickOutside);

        return()=>{

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    },[]);

    async function markAsRead(id){

        try{

            await readNotification(id);

            loadNotifications();

        }catch(error){

            console.error(error);

        }

    }

    async function markAllAsRead(){

        try{

            await readAllNotifications();

            loadNotifications();

        }catch(error){

            console.error(error);

        }

    }

    async function remove(id){

        try{

            await deleteNotification(id);

            loadNotifications();

        }catch(error){

            console.error(error);

        }

    }

    const unreadCount=notifications.filter(
        notification=>!notification.lue
    ).length;

    return(

        <div
            className="notification"
            ref={ref}
        >

            <button
                className="notification-btn"
                onClick={()=>setOpen(!open)}
            >

                <FaBell size={20}/>

                {unreadCount>0&&(

                    <span className="badge">

                        {unreadCount}

                    </span>

                )}

            </button>

            {open&&(

                <div className="notification-menu">

                    <div className="notification-header">

                        <h3>

                            Notifications

                        </h3>

                        {notifications.length>0&&(

                            <button
                                onClick={markAllAsRead}
                            >

                                <FaCheckDouble size={16}/>

                            </button>

                        )}

                    </div>

                    {notifications.length===0?(

                        <p className="empty">

                            Aucune notification

                        </p>

                    ):(

                        notifications.map(notification=>(

                            <div
                                key={notification.id}
                                className={`notification-item ${
                                    notification.lue
                                        ? ""
                                        : "unread"
                                }`}
                            >

                                <div
                                    className="notification-body"
                                    onClick={()=>
                                        markAsRead(notification.id)
                                    }
                                >

                                    <strong>

                                        {notification.titre}

                                    </strong>

                                    <p>

                                        {notification.message}

                                    </p>

                                </div>

                                <button
                                    onClick={()=>
                                        remove(notification.id)
                                    }
                                >

                                    <FaTrash size={14}/>

                                </button>

                            </div>

                        ))

                    )}

                </div>

            )}

        </div>

    );

}