import axios from "axios"
const baseURL = global.env === "production"? "http://39.108.236.220:3001" : "http://localhost:3001"
const server = axios.create({
  baseURL,
})
export default server