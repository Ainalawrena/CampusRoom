import "./PlanningSemaine.css";

const jours = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi"];
const heures = [8,9,10,11,12,13,14,15,16,17];

export default function PlanningSemaine({ reservations = [] }) {

    function estOccupe(jour, heure) {

        return reservations.some((reservation) => {

            const date = new Date(reservation.date);

            const numeroJour = date.getDay();

            const map = {
                1:0,
                2:1,
                3:2,
                4:3,
                5:4
            };

            if(map[numeroJour] !== jour) return false;

            const debut = parseInt(reservation.heure_debut.substring(0,2));
            const fin = parseInt(reservation.heure_fin.substring(0,2));

            return heure >= debut && heure < fin;

        });

    }

    return (

        <div className="planning">

            <table className="planning-table">

                <thead>

                    <tr>

                        <th>Heure</th>

                        {jours.map(jour=>(
                            <th key={jour}>{jour}</th>
                        ))}

                    </tr>

                </thead>

                <tbody>

                    {heures.map((heure)=>(

                        <tr key={heure}>

                            <td>{heure}:00</td>

                            {[0,1,2,3,4].map((jour)=>(

                                <td
                                    key={jour}
                                    className={
                                        estOccupe(jour,heure)
                                            ? "occupied"
                                            : "free"
                                    }
                                />

                            ))}

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}