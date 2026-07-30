import axios from "./axios";

export const getEquipements = () =>
    axios.get("/equipements");