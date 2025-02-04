// app/search/[[...slug]]/page.js

import { notFound } from "next/navigation";

// Caso queira gerar parâmetros estáticos para algumas cidades populares, você pode usar essa função.
// No nosso exemplo, retornamos um array vazio para que a renderização seja totalmente dinâmica.
export async function generateStaticParams() {
  return [];
}

// Função auxiliar para normalizar strings (remove acentos e converte para minúsculas)
const normalize = (str) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default async function SearchPage({ params }) {
  // Se o usuário acessar apenas /search, sem slug, mostramos uma página padrão.
  if (!params.slug || params.slug.length === 0) {
    return (
      <div className="min-h-screen p-8">
        <h1>Página de Busca</h1>
        <p>Escolha uma cidade para ver os resultados.</p>
      </div>
    );
  }

  // Concatena o array de segmentos do slug em uma única string
  // Exemplo: ["acompanhantes", "em", "sao-paulo", "sp"] → "acompanhantes-em-sao-paulo-sp"
  const slug = params.slug.join("-");
  
  // Expressão regular para extrair:
  //   grupo 1: base (ex: "acompanhantes", "garotos-de-programa", ou "travestis-transex-transgenero")
  //   grupo 2: cidade (ex: "sao-paulo")
  //   grupo 3: estado (ex: "sp")
  const regex = /(.*?)\-em\-(.*?)-(\w{2})$/;
  const match = slug.match(regex);
  if (!match) {
    // Se o slug não estiver no formato esperado, retorna 404
    notFound();
  }

  const base = match[1];                      // ex: "acompanhantes"
  const citySlug = match[2];                    // ex: "sao-paulo"
  const uf = match[3].toUpperCase();            // ex: "SP"
  const cityName = citySlug.replace(/-/g, " ");  // "sao-paulo" → "sao paulo"

  // Consulta a API do IBGE para validar se a cidade existe
  const ibgeRes = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/municipios");
  if (!ibgeRes.ok) {
    throw new Error("Erro ao buscar cidades na API do IBGE");
  }
  const ibgeCities = await ibgeRes.json();

  // Procura na lista da API uma cidade cujo nome, após normalização, seja igual à extraída do slug
  const foundCity = ibgeCities.find(
    (city) => normalize(city.nome) === normalize(cityName)
  );

  if (!foundCity) {
    // Se a cidade não for encontrada, renderiza a página 404
    notFound();
  }

  // Aqui você pode buscar os dados reais dos acompanhantes para a cidade e categoria
  // Exemplo: const escortsRes = await fetch(`https://suaapi.com/escorts?cidade=${cityName}&estado=${uf}&categoria=${base}`);
  // const escorts = await escortsRes.json();
  // Para fins de exemplo, usamos dados simulados:
  const escorts = [
    { nome: "Acompanhante 1", preco: "R$ 250/h", tipo: "rubi" },
    { nome: "Acompanhante 2", preco: "R$ 300/h", tipo: "pink" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4">
      {/* Cabeçalho da página */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold">
          {base === "acompanhantes"
            ? "Mulheres"
            : base === "garotos-de-programa"
            ? "Homens"
            : "Trans"}
          {" "}
          em {cityName}, {uf}
        </h1>
      </header>

      {/* Renderiza os dados dos acompanhantes ou uma mensagem se não houver resultados */}
      {escorts.length === 0 ? (
        <p className="text-center text-gray-600 mt-4">
          Ainda não há acompanhantes cadastrados em {cityName}, {uf}.
        </p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {escorts.map((escort, index) => (
            <li key={index} className="p-4 bg-white rounded shadow">
              <h2 className="text-xl font-semibold">{escort.nome}</h2>
              <p className="text-gray-600">{escort.preco}</p>
              {/* Aqui você pode renderizar um card mais completo */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
