import axios from 'axios'
import Constants from './constants';

// Login API
const logIn = async (userName) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios({
                method: 'get',
                url: Constants.BASE_URL + 'api/users/login/' + userName
            })
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
}

// GET all Users API
const getContacts = async (user) => {
    axios.defaults.headers={
         Authorization:`Bearer `+localStorage.getItem('token')
     }
    axios.post(`http://localhost:8080/getAllUserAddedByUser`,user.mobile).then(
        (response) => {
            console.log(response.data);
            return response.data;
        },
        (Error) => {
            console.log(Error);
        }
    )
}


const API = {
    logIn,
    getContacts
};
export default API;