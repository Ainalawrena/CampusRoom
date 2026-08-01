import "./Badge.css";

export default function Badge({ children, type }) {
    return (
        <span className={`badge ${type}`}>
            {children}
        </span>
    );
}