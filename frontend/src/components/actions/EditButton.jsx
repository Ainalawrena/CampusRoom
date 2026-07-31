import {FaPen} from "react-icons/fa";

export default function EditButton({onClick}){

    return(
        <button className="action-btn edit-btn" onClick={onClick}>
            <FaPen/>
            Modifier
        </button>
    );

}