import { checkSession } from "@/utils/checkSession";
import Planos from "./Planos";


export default async function PlanosPage() {
  await checkSession('/planos'); 
  return <Planos />;
}
