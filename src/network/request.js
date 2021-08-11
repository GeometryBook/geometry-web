import axios from "axios";

const baseInstance = axios.create({
  timeout: 5000
})

export default function(config) {
  return baseInstance(config)
}