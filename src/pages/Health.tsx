import React from 'react';
import { healthAPI } from '../services/api';

export const Health: React.FC = () => {
  const [status, setStatus] = React.useState<string>('Verificando...');
  React.useEffect(() => {
    healthAPI
      .healthz()
      .then(() => setStatus('OK'))
      .catch(() => setStatus('OFFLINE'));
  }, []);
  return <div className="p-8 text-center">Backend: {status}</div>;
};


