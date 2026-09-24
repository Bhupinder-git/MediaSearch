// Importing axios
import axios from 'axios';

// Creating an instance of axios
const axiosInstance = axios.create({});

// function to make api call's using the axios object
const apiConnector = (method, url, body, headers, params) => {
    return axiosInstance({
        method : `${method}`,
        url : `${url}`,
        body : body ? body : null,
        headers : headers ? headers : null,
        params : params ? params : null
    });
}

// exporting it
export default apiConnector;