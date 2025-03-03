import { cookies } from 'next/headers';
import { checkSession } from '@/utils/checkSession';
import { redirect } from 'next/navigation';  // Importando o redirect do next/navigation
import Planos from './Planos';

const PlanosPage = async () => {
  const session = await checkSession('/planos');

  if (!session) {
    redirect('/');
  }

  return <Planos />;
};

export default PlanosPage;
