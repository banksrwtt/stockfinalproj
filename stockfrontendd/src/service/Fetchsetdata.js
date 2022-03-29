import axios from "axios"

export async function fetchsetgraph(token) {
    const res = await axios.get(`http://localhost:5000/setprofile?token=${token}`)
    const info = await res.data

    return info

}