import axios from "axios"

export async function fetchset50graph(token) {
    const res = await axios.get(`http://localhost:5000/set50?token=${token}`)
    const info = await res.data

    return info

}