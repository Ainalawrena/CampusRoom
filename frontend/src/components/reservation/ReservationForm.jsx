import { useState } from "react";
import { createReservation } from "../../api/reservation";
import Button from "../ui/Button";
import "./ReservationForm.css";

const initialForm = {
    date: "",
    heure_debut: "",
    heure_fin: "",
    motif: ""
};

export default function ReservationForm({ salleId, onSuccess }) {

    const [form, setForm] = useState(initialForm);

    const handleChange = e =>
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    async function handleSubmit(e) {
        e.preventDefault();

        try {

            await createReservation({
                salle_id: salleId,
                ...form
            });

            alert("Réservation enregistrée.");

            setForm(initialForm);

            onSuccess?.();

        } catch (error) {

            if (error.response?.status === 409) {
                alert("Cette salle est déjà réservée sur ce créneau.");
                return;
            }

            console.error(error);
            alert("Impossible d'effectuer la réservation.");
        }
    }

    return (
        <form
            id="reservation"
            className="reservation-form"
            onSubmit={handleSubmit}
        >

            <h2>Nouvelle réservation</h2>

            <div className="form-group">
                <label>Jour</label>
                <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="time-row">

                <div className="form-group">
                    <label>Heure début</label>
                    <input
                        type="time"
                        name="heure_debut"
                        value={form.heure_debut}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Heure fin</label>
                    <input
                        type="time"
                        name="heure_fin"
                        value={form.heure_fin}
                        onChange={handleChange}
                        required
                    />
                </div>

            </div>

            <div className="form-group">
                <label>Motif</label>
                <textarea
                    name="motif"
                    placeholder="Ex : Cours de Génie Logiciel"
                    value={form.motif}
                    onChange={handleChange}
                />
            </div>

            <Button type="submit">
                Réserver
            </Button>

        </form>
    );
}