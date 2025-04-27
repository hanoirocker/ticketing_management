import axios from "axios";
import { useState } from "react";

export default function useRequest({ url, method, body }) {
  const [errors, setErrors] = useState(null);

  const doRequests = async () => {
    try {
      // Clear any previous errors before making a new request
      setErrors(null);

      const res = await axios[method](url, body);
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

  return { doRequests, errors }
};