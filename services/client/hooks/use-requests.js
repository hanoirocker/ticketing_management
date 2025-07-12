import axios from "axios";
import { useState } from "react";
/**
 * 
 * @param {string} url - string represent the API route  
 * @param {string} method - type of method of the request  
 * @param {string} body - payload to include  
 * @param {string} onSuccess - callback to execute after a successfull response 
 */
export default function useRequest({ url, method, body, onSuccess }) {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      // Clear any previous errors before making a new request
      setErrors(null);
      const res = await axios[method](url, body);

      // If any success callback is provided, call it with the response data
      if (onSuccess) {
        onSuccess(res.data);
      }

      return res.data;
    } catch (err) {
      setErrors(<div className="alert alert-danger">
        <h4>Damn!</h4>
        <ul className="my-0">
          {err.response.data.errors.map(err => <li key={err.message}>{err.message}</li>)}
        </ul>
      </div>);
    };
  };

  return { doRequest, errors }
};