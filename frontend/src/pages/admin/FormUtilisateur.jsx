import { useEffect, useState } from "react";
import { createUser, updateUser } from "../../api/admin";
import "./FormUtilisateur.css";

const emptyForm = {
    nom: "",
    prenom: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "etudiant"
};

export default function FormUtilisateur({
    open,
    user,
    onClose,
    onSuccess
}) {
    const [form, setForm] = useState(emptyForm);
    useEffect(() => {
        setForm(
            user
                ? {
                    nom: user.nom,
                    prenom: user.prenom,
                    email: user.email,
                    password: "",
                    password_confirmation: "",
                    role: user.role
                }
                : emptyForm
        );

    }, [user, open]);

    function handleChange(e) {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const data = { ...form };
            if (user && !data.password) {
                delete data.password;
                delete data.password_confirmation;
            }
            if (user)
                await updateUser(user.id, data);
            else
                await createUser(data);
            onSuccess();
        } catch (error) {
            console.error(error);
            alert("Une erreur est survenue.");
        }
    }
    if (!open) return null;
    return (
        <div className="modal-overlay">

            <div className="modal">

                <div className="modal-header">
                    <h2>
                        {user ? "Modifier un utilisateur" : "Ajouter un utilisateur"}
                    </h2>
                </div>

                <form className="form-grid" onSubmit={handleSubmit}>

                    <div>
                        <label>Nom</label>
                        <input
                            name="nom"
                            value={form.nom}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label>Prénom</label>
                        <input
                            name="prenom"
                            value={form.prenom}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="full">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label>Mot de passe</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder={user ? "Laisser vide pour conserver" : ""}
                            required={!user}
                        />
                    </div>

                    <div>
                        <label>Confirmation</label>
                        <input
                            type="password"
                            name="password_confirmation"
                            value={form.password_confirmation}
                            onChange={handleChange}
                            required={!user}
                        />
                    </div>

                    <div className="full">
                        <label>Rôle</label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                        >
                            <option value="etudiant">Étudiant</option>
                            <option value="enseignant">Enseignant</option>
                            <option value="logistique">Logistique</option>
                            <option value="administrateur">Administrateur</option>
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="cancel"
                            onClick={onClose}
                        >
                            Annuler
                        </button>

                        <button
                            type="submit"
                            className="save"
                        >
                            {user ? "Modifier" : "Ajouter"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}