import {FaTrash} from "react-icons/fa";

export default function DeleteButton({onClick}){

    return(
        <button className="action-btn delete-btn" onClick={onClick}>
            <FaTrash/>
            Supprimer
        </button>
    );

}