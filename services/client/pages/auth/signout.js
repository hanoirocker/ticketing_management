import { useEffect } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-requests';

export default () => {
  const { doRequest } = useRequest({
    method: 'post',
    url: '/api/users/signout',
    body: {},
    onSuccess: () => {
      // Redirect to the landing page after signing out
      Router.push('/');
    }
  });

  useEffect(() => {
    doRequest();
  }, []);

  return (
    <div>
      Signing you out...
    </div>
  );
};