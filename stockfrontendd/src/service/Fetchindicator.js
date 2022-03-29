import axios from "axios"

export async function fetchindicator(token) {
    const res = await axios.get(`http://localhost:5000/indicator?token=${token}`)
    const info = await res.data

    return info

}