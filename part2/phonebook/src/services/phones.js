import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(responce => responce.data)
}

const addNew = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(responce => responce.data)
}

const deleteOne = id => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(responce => responce.data)
}

const modify = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(responce => responce.data)
}
export default {getAll, addNew, deleteOne, modify}