import "./Card.css";

export default function Card({
    title,
    value,
    icon,
    color = "#52796F"
}) {
    return (

        <div className="card">

            <div
                className="card-icon"
                style={{ background: color }}
            >
                {icon}
            </div>

            <div className="card-content">

                <p>{title}</p>

                <h2>{value}</h2>

            </div>

        </div>

    );
}