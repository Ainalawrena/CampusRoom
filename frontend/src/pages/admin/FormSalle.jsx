import { useEffect, useState } from "react";
import { createSalle, updateSalle } from "../../api/admin";
import { getEquipements } from "../../api/equipement";
import "./FormSalle.css";

export default function FormSalle({ open, onClose, onSuccess, salle = null }) {

    const [equipements, setEquipements] = useState([]);

    const [form, setForm] = useState({
        nom: "",
        capacite: "",
        statut: "disponible",
        batiment: "",
        equipements: []
    });

    useEffect(() => {
        if (open)
            getEquipements().then(({ data }) => setEquipements(data));
    }, [open]);

    useEffect(() => {

        if (salle) {

            setForm({
                nom: salle.nom,
                capacite: salle.capacite,
                statut: salle.statut,
                batiment: salle.batiment ?? "",
                equipements: salle.equipements.map(e => e.id)
            });

        } else {

            setForm({
                nom: "",
                capacite: "",
                statut: "disponible",
                batiment: "",
                equipements: []
            });

        }

    }, [salle]);

    if (!open) return null;

    function change(e) {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    }

    function changeEquipement(id) {
        setForm(f => ({
            ...f,
            equipements: f.equipements.includes(id)
                ? f.equipements.filter(i => i !== id)
                : [...f.equipements, id]
        }));
    }

    async function submit(e) {

        e.preventDefault();

        try {

            if (salle)
                await updateSalle(salle.id, form);
            else
                await createSalle(form);

            onSuccess();
            onClose();

        } catch (error) {

            console.error(error);

        }

    }

    return (

        <div className="salle-modal">

            <div className="salle-modal-content">

                <h2>
                    {salle ? "Modifier la salle" : "Ajout d'une nouvelle salle"}
                </h2>

                <form onSubmit={submit}>

                    <label>
                        Nom
                        <input
                            name="nom"
                            value={form.nom}
                            onChange={change}
                            required
                        />
                    </label>

                    <label>
                        Capacité
                        <input
                            type="number"
                            name="capacite"
                            value={form.capacite}
                            onChange={change}
                            required
                        />
                    </label>

                    <label>
                        Bâtiment
                        <input
                            name="batiment"
                            value={form.batiment}
                            onChange={change}
                        />
                    </label>

                    <label>
                        Statut
                        <select
                            name="statut"
                            value={form.statut}
                            onChange={change}
                        >
                            <option value="disponible">Disponible</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="occupee">Occupée</option>
                        </select>
                    </label>

                    <label>Équipements</label>

                    <div className="salle-equipements-list">

                        {equipements.map(eq => (

                            <label key={eq.id}>

                                <input
                                    type="checkbox"
                                    checked={form.equipements.includes(eq.id)}
                                    onChange={() => changeEquipement(eq.id)}
                                />

                                {eq.nom}

                            </label>

                        ))}

                    </div>

                    <div className="salle-form-actions">

                        <button
                            type="button"
                            className="salle-cancel"
                            onClick={onClose}
                        >
                            Annuler
                        </button>

                        <button
                            type="submit"
                            className="salle-save"
                        >
                            Enregistrer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}