import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import "./ActionButtons.css";

export default function ActionButtons({onEdit,onDelete}){

    return(

        <div className="actions">

            <EditButton onClick={onEdit}/>

            <DeleteButton onClick={onDelete}/>

        </div>

    );

}