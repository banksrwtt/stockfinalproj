import axios from "axios"

export async function fetchset100graph(token) {
    const res = await axios.get(`http://localhost:5000/set100?token=${token}`)
    const info = await res.data

    return info

}