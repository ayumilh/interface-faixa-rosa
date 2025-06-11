// ─── src/app/(feed)/search/[[...slug]]/page.js ───

import { notFound } from "next/navigation";
import ClientSearch from "./ClientSearch"; // este já começa com "use client"

export default async function Page({ params }) {
  // 1) Monta slugString e extrai cidade/UF
  const slugString = Array.isArray(params.slug) ? params.slug.join("/") : params.slug;
  const regex = /(.*?)\-em\-(.*?)-(\w{2})$/;
  const match = slugString?.match(regex);

  let cityName = null;
  let stateUF = null;

  if (match) {
    const citySlug = match[2];
    stateUF = match[3].toUpperCase();
    cityName = decodeURIComponent(citySlug).replace(/-/g, " ");
  }

  // 2) Se o slug existir e não casar com o regex, devolve 404
  if (slugString && !match) {
    notFound();
  }


  // 4) Retorna o componente client-side
  return (
    <ClientSearch
      initialCity={cityName}
      initialState={stateUF}
    />
  );
}
