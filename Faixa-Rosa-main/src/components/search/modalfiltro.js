"use client";
import { useState } from "react";
import { FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";

export default function ModalFiltro({ showModalFiltro, setShowModalFiltro }) {
  if (!showModalFiltro) return null;

  const [selectedFilters, setSelectedFilters] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
  const [filters, setFilters] = useState({
    price: [50, 999],
    age: [18, 60],
    weight: [50, 150],
    height: [150, 200],
    footSize: [35, 45],
  });

  const toggleFilter = (filter) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const handleRangeChange = (field, event, newValue) => {
    setFilters((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  const filtros = {
    "Método de Pagamento": ["Pix", "Cartão de Crédito", "Dinheiro", "Cartão de Débito"],
    "Novidades": ["Novidade", "Novo(a) na cidade", "De volta à cidade"],
    "Reviews": ["Possui review"],
    "Serviços": [
      "Faz sexo oral sem preservativo", "Recebe sexo anal com preservativo", "Recebe sexo vaginal com preservativo",
      "Faz striptease", "Faz masturbação", "Recebe masturbação", "Faz massagem tradicional", "Faz massagem tântrica",
      "Recebe massagem tradicional", "Recebe massagem tântrica", "Faz sexo oral com preservativo", "Recebe sexo oral com preservativo",
      "Faz sexo vaginal com preservativo", "Faz sexo anal com preservativo", "Faz sexo virtual", "Faz dupla penetração",
      "Recebe dupla penetração", "Faz tripla penetração", "Recebe tripla penetração", "Faz dominação", "Recebe dominação",
      "Faz roleplay", "Faz penetração com acessórios sexuais", "Recebe penetração com acessórios sexuais", "Faz beijo grego",
      "Recebe beijo grego", "Faz podolatria", "Recebe podolatria", "Faz bondage", "Recebe bondage", "Faz sadomasoquismo",
      "Recebe sadomasoquismo", "Faz fisting", "Recebe fisting", "Faz facefuck", "Recebe facefuck", "Faz quirofilia",
      "Faz squirt", "Faz chuva dourada", "Recebe chuva dourada", "Faz chuva marrom", "Recebe chuva marrom", "Faz beijo na boca",
      "Permite filmagem", "Voyeurismo", "Faz trampling", "Recebe trampling", "Uso de roupas de fantasia/uniformes",
      "Utiliza acessórios eróticos", "Faz viagem"
    ],
    "Aparência": {
      "Etnia/descendência": ["Branco", "Caboclo", "Cafuza", "Indígena", "Mestiço", "Mulato", "Negro", "Oriental", "Pardo"],
      "Estilo de cabelo": ["Loiro", "Moreno", "Ruivo", "Castanho", "Colorido", "Grisalho", "Sem cabelo"],
      "Tatuagens": ["Sem tatuagens", "Com tatuagens"],
      "Silicone": ["Sem silicone", "Com silicone"],
      "Piercings": ["Sem piercings", "Com piercings"],
      "Comportamento sexual": ["Ativo", "Passivo"],
      "Preferência de comportamento": ["Gosta de comandar", "Gosta de ser comandado"],
      "Cor dos olhos": ["Azul", "Castanho", "Cinza", "Mel", "Verde", "Preto"]
    },
    "Local": ["A domicílio", "Aceita viajar", "Festas e eventos", "Hotéis", "Local próprio", "Motéis"],
    "Atende": ["Casais", "Homens", "Homens trans", "Mulheres", "Mulheres trans", "Não binário"],
    "Clientes em conjunto": ["1 cliente", "2 clientes", "3 clientes", "4 ou mais clientes"],
    "Idioma": ["Alemão", "Espanhol", "Francês", "Inglês", "Italiano", "Outros", "Português"]
  };

  // Função para fechar o modal ao clicar no backdrop
  const handleBackdropClick = () => {
    setShowModalFiltro(false);
  };

  // Função para impedir o fechamento ao clicar dentro do modal
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick} // Fecha o modal ao clicar no backdrop
    >
      <div
        className="bg-white w-full max-w-5xl p-6 md:p-8 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
        onClick={handleModalClick} // Impede o fechamento ao clicar dentro do modal
      >
        {/* Header do Modal */}
        <div className="flex justify-between items-center border-b pb-4">
          <h2 id="modal-title" className="text-2xl font-semibold text-gray-800">
            Filtros Avançados
          </h2>
          <button
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={() => setShowModalFiltro(false)}
            aria-label="Fechar modal"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        {/* Filtros */}
        <div className="mt-6 space-y-8">
          {/* Filtros de Valor, Idade, Peso, Altura e Tamanho do Pé */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Filtragem por Parâmetros</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Valor */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Valor (R$)</label>
                <Box sx={{ width: "100%" }}>
                  <Slider
                    value={filters.price}
                    onChange={(e, newValue) => handleRangeChange("price", e, newValue)}
                    valueLabelDisplay="auto"
                    min={50}
                    max={999}
                    color="secondary"
                  />
                </Box>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>R$ {filters.price[0]}</span>
                  <span>R$ {filters.price[1]}</span>
                </div>
              </div>
              {/* Idade */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Idade (Anos)</label>
                <Box sx={{ width: "100%" }}>
                  <Slider
                    value={filters.age}
                    onChange={(e, newValue) => handleRangeChange("age", e, newValue)}
                    valueLabelDisplay="auto"
                    min={18}
                    max={60}
                    color="secondary"
                  />
                </Box>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>{filters.age[0]} anos</span>
                  <span>{filters.age[1]} anos</span>
                </div>
              </div>
              {/* Peso */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Peso (kg)</label>
                <Box sx={{ width: "100%" }}>
                  <Slider
                    value={filters.weight}
                    onChange={(e, newValue) => handleRangeChange("weight", e, newValue)}
                    valueLabelDisplay="auto"
                    min={30}
                    max={200}
                    color="secondary"
                  />
                </Box>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>{filters.weight[0]} kg</span>
                  <span>{filters.weight[1]} kg</span>
                </div>
              </div>
              {/* Altura */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Altura (cm)</label>
                <Box sx={{ width: "100%" }}>
                  <Slider
                    value={filters.height}
                    onChange={(e, newValue) => handleRangeChange("height", e, newValue)}
                    valueLabelDisplay="auto"
                    min={140}
                    max={220}
                    color="secondary"
                  />
                </Box>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>{filters.height[0]} cm</span>
                  <span>{filters.height[1]} cm</span>
                </div>
              </div>
              {/* Tamanho do Pé */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Tamanho do Pé (BR)</label>
                <Box sx={{ width: "100%" }}>
                  <Slider
                    value={filters.footSize}
                    onChange={(e, newValue) => handleRangeChange("footSize", e, newValue)}
                    valueLabelDisplay="auto"
                    min={30}
                    max={50}
                    color="secondary"
                  />
                </Box>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>{filters.footSize[0]}</span>
                  <span>{filters.footSize[1]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros Dinâmicos com Estilo Profissional */}
          {Object.keys(filtros).map((categoria) => (
            <div key={categoria} className="mb-4">
              <div
                onClick={() => toggleSection(categoria)}
                className="flex justify-between items-center cursor-pointer py-2 px-4 bg-gray-100 rounded-lg transition-colors duration-200 hover:bg-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-700">{categoria}</h3>
                {expandedSections[categoria] ? (
                  <FaChevronUp className="text-gray-600" />
                ) : (
                  <FaChevronDown className="text-gray-600" />
                )}
              </div>
              {expandedSections[categoria] && (
                <div className="mt-2 p-4 bg-white rounded-lg shadow-inner transition-all duration-300 ease-in-out">
                  {Array.isArray(filtros[categoria]) ? (
                    <div className="flex flex-wrap gap-2">
                      {filtros[categoria].map((item) => (
                        <button
                          key={item}
                          onClick={() => toggleFilter(item)}
                          className={`px-4 py-2 rounded-full text-sm font-medium focus:outline-none ${
                            selectedFilters.includes(item)
                              ? "bg-pink-500 text-white"
                              : "bg-gray-200 text-gray-700"
                          } transition duration-200 hover:bg-pink-600 hover:text-white`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  ) : (
                    Object.keys(filtros[categoria]).map((subCategoria) => (
                      <div key={subCategoria} className="mb-4">
                        <h4 className="text-md font-medium text-gray-600 mt-2 mb-2">
                          {subCategoria}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {filtros[categoria][subCategoria].map((item) => (
                            <button
                              key={item}
                              onClick={() => toggleFilter(item)}
                              className={`px-4 py-2 rounded-full text-sm font-medium focus:outline-none ${
                                selectedFilters.includes(item)
                                  ? "bg-pink-500 text-white"
                                  : "bg-gray-200 text-gray-700"
                              } transition duration-200 hover:bg-pink-600 hover:text-white`}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Botões de Ação */}
        <div className="mt-6 flex flex-col md:flex-row justify-between items-center border-t pt-4 space-y-4 md:space-y-0">
          <button
            onClick={() => setShowModalFiltro(false)}
            className="w-full md:w-auto px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition duration-200"
          >
            Fechar
          </button>
          <button
            onClick={() => {
              // Adicione a lógica para aplicar os filtros aqui
              setShowModalFiltro(false);
            }}
            className="w-full md:w-auto px-6 py-2 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition duration-200"
          >
            Ver Resultados
          </button>
        </div>
      </div>
    </div>
  );
}
