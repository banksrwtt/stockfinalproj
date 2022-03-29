import axios from "axios"

export async function fetchprofile(token) {
    const res = await axios.get(`http://localhost:5000/notification?token=${token}`)
    const info = await res.data

    
    return info


}
