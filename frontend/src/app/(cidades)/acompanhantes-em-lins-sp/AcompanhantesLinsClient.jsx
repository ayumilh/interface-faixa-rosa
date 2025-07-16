"use client";

import React, { useState, useEffect, createContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkle,
  Star,
  Camera,
  ShieldCheck,
  Funnel,
  CaretDown,
  CaretUp,
  X,
  MagnifyingGlass,
  MapPin,
  Clock,
  Heartbeat,
} from "phosphor-react";

// Importando componentes compartilhados
import Navbar from "../../../components/Navbar";
import Stories from "../../../components/search/stories";


// Importando componentes de Card específicos para diferentes planos/temas
import CardVIP from "../../../components/search/CardVIP";
import CardVIPDark from "../../../components/search/CardVIPDark";
import CardPink from "../../../components/search/CardPink";
import CardPinkDark from "../../../components/search/CardPinkDark";
import CardSafira from "../../../components/search/CardSafira";
import CardSafiraDark from "../../../components/search/CardSafiraDark";
import CardRubi from "../../../components/search/CardRubi";
import CardRubiDark from "../../../components/search/CardRubiDark";

// Importando hooks e contexto personalizados
import { usePlan } from "../../../context/PlanContext";
import useStatusTracker from "../../../hooks/useStatusTracker";

/**
 * Função auxiliar para criar um slug amigável para URL a partir do texto.
 * @param {string} text - O texto de entrada para slugificar.
 * @returns {string} A string slugificada.
 */
function slugify(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/--+/g, "-");
}

/**
 * FiltrosAvancados Component
 * Fornece um modal para opções de filtro avançadas para perfis de acompanhantes.
 * Aprimorado com melhor espaçamento visual e estilização de entrada.
 * @param {object} props - Propriedades do componente.
 * @param {boolean} props.isOpen - Controla a visibilidade do modal.
 * @param {function} props.onClose - Callback para fechar o modal.
 * @param {function} props.onApplyFilters - Callback para quando os filtros são aplicados.
 * @returns {JSX.Element} O modal de filtros avançados.
 */
function FiltrosAvancados({ isOpen, onClose, onApplyFilters }) {
  const [filters, setFilters] = useState({
    ageRange: [18, 50],
    priceRange: [100, 1000],
    bodyType: "",
    hairColor: "",
    eyeColor: "",
    services: [],
    availability: "",
    hasPhotos: false,
    hasVideos: false,
    verified: false,
  });
  const [activeTab, setActiveTab] = useState("basic");

  const bodyTypes = ["Magra", "Curvilínea", "Plus Size", "Atlética", "Normal"];
  const hairColors = ["Loira", "Morena", "Ruiva", "Negra", "Colorido"];
  const eyeColors = ["Castanhos", "Azuis", "Verdes", "Negros", "Mel"];
  const servicesList = [
    "Acompanhante", "Massagem", "Jantar", "Viagem", "Eventos",
    "Beijo Grego", "Anal", "Oral sem camisinha", "Punheta", "Suruba",
    "Cosplay", "Dominatrix", "Bdsm", "Dupla", "Fetichismo",
    "Primeira vez", "Strip Tease", "Sexo a três", "Chuva Dourada", "Chuva Negra"
  ];

  function apply() {
    onApplyFilters(filters);
    onClose();
  }

  function reset() {
    setFilters({
      ageRange: [18, 50],
      priceRange: [100, 1000],
      bodyType: "",
      hairColor: "",
      eyeColor: "",
      services: [],
      availability: "",
      hasPhotos: false,
      hasVideos: false,
      verified: false,
    });
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-center items-end sm:items-center px-4 md:px-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)" }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className="w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] flex flex-col"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Cabeçalho do Modal */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center z-10 rounded-t-3xl">
              <div className="flex items-center gap-2">
                <Funnel size={28} className="text-pink-600" weight="duotone" />
                <h3 className="font-bold text-xl sm:text-2xl text-gray-800">Filtros Avançados</h3>
              </div>
              <button onClick={onClose} aria-label="Fechar filtros" className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700">
                <X size={24} weight="bold" />
              </button>
            </div>

            {/* Navegação por abas */}
            <div className="flex border-b border-gray-100">
              {["basic", "appearance", "services"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-sm sm:text-base font-semibold transition-colors ${
                    activeTab === tab
                      ? "border-b-2 border-pink-500 text-pink-600"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {tab === "basic" ? "Básico" : tab === "appearance" ? "Aparência" : "Serviços"}
                </button>
              ))}
            </div>

            {/* Conteúdo do Modal - baseado na aba ativa */}
            <div className="p-4 sm:p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
              {activeTab === "basic" && (
                <div className="space-y-6">
                  {/* Filtro de Faixa Etária */}
                  <div>
                    <label htmlFor="ageRange" className="block text-base font-medium text-gray-700 mb-3">
                      Idade: <span className="font-semibold text-pink-600">{filters.ageRange[0]} – {filters.ageRange[1]}</span> anos
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        min="18"
                        max="60"
                        value={filters.ageRange[0]}
                        onChange={(e) =>
                          setFilters((f) => ({
                            ...f,
                            ageRange: [Number(e.target.value), Math.max(Number(e.target.value), f.ageRange[1])],
                          }))
                        }
                        className="w-16 p-2 border border-gray-300 rounded-lg text-center text-sm focus:ring-pink-500 focus:border-pink-500"
                      />
                      <input
                        id="ageRange"
                        type="range"
                        min="18"
                        max="60"
                        value={filters.ageRange[0]}
                        onChange={(e) =>
                          setFilters((f) => ({
                            ...f,
                            ageRange: [Number(e.target.value), Math.max(Number(e.target.value), f.ageRange[1])],
                          }))
                        }
                        className="flex-1 accent-pink-500 h-2 rounded-lg appearance-none cursor-pointer"
                      />
                      <input
                        type="range"
                        min="18"
                        max="60"
                        value={filters.ageRange[1]}
                        onChange={(e) =>
                          setFilters((f) => ({
                            ...f,
                            ageRange: [Math.min(f.ageRange[0], Number(e.target.value)), Number(e.target.value)],
                          }))
                        }
                        className="flex-1 accent-purple-500 h-2 rounded-lg appearance-none cursor-pointer"
                      />
                       <input
                        type="number"
                        min="18"
                        max="60"
                        value={filters.ageRange[1]}
                        onChange={(e) =>
                          setFilters((f) => ({
                            ...f,
                            ageRange: [Math.min(f.ageRange[0], Number(e.target.value)), Number(e.target.value)],
                          }))
                        }
                        className="w-16 p-2 border border-gray-300 rounded-lg text-center text-sm focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>
                  </div>

                  {/* Filtro de Faixa de Preço */}
                  <div>
                    <label htmlFor="priceRange" className="block text-base font-medium text-gray-700 mb-3">
                      Preço: <span className="font-semibold text-pink-600">R$ {filters.priceRange[0]} – R$ {filters.priceRange[1]}</span>
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        min="50"
                        max="2000"
                        step="50"
                        value={filters.priceRange[0]}
                        onChange={(e) =>
                          setFilters((f) => ({
                            ...f,
                            priceRange: [Number(e.target.value), Math.max(Number(e.target.value), f.priceRange[1])],
                          }))
                        }
                        className="w-20 p-2 border border-gray-300 rounded-lg text-center text-sm focus:ring-pink-500 focus:border-pink-500"
                      />
                      <input
                        id="priceRange"
                        type="range"
                        min="50"
                        max="2000"
                        step="50"
                        value={filters.priceRange[0]}
                        onChange={(e) =>
                          setFilters((f) => ({
                            ...f,
                            priceRange: [Number(e.target.value), Math.max(Number(e.target.value), f.priceRange[1])],
                          }))
                        }
                        className="flex-1 accent-pink-500 h-2 rounded-lg appearance-none cursor-pointer"
                      />
                      <input
                        type="range"
                        min="50"
                        max="2000"
                        step="50"
                        value={filters.priceRange[1]}
                        onChange={(e) =>
                          setFilters((f) => ({
                            ...f,
                            priceRange: [Math.min(f.priceRange[0], Number(e.target.value)), Number(e.target.value)],
                          }))
                        }
                        className="flex-1 accent-purple-500 h-2 rounded-lg appearance-none cursor-pointer"
                      />
                      <input
                        type="number"
                        min="50"
                        max="2000"
                        step="50"
                        value={filters.priceRange[1]}
                        onChange={(e) =>
                          setFilters((f) => ({
                            ...f,
                            priceRange: [Math.min(f.priceRange[0], Number(e.target.value)), Number(e.target.value)],
                          }))
                        }
                        className="w-20 p-2 border border-gray-300 rounded-lg text-center text-sm focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>
                  </div>

                  {/* Checkboxes para Recursos do Perfil */}
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer text-base text-gray-700 group">
                      <input
                        type="checkbox"
                        checked={filters.hasPhotos}
                        onChange={(e) =>
                          setFilters((f) => ({ ...f, hasPhotos: e.target.checked }))
                        }
                        className="form-checkbox h-5 w-5 text-pink-600 rounded-md border-gray-300 focus:ring-pink-500 transition-colors"
                      />
                      <span>Com fotos verificadas</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer text-base text-gray-700 group">
                      <input
                        type="checkbox"
                        checked={filters.hasVideos}
                        onChange={(e) =>
                          setFilters((f) => ({ ...f, hasVideos: e.target.checked }))
                        }
                        className="form-checkbox h-5 w-5 text-pink-600 rounded-md border-gray-300 focus:ring-pink-500 transition-colors"
                      />
                      <span>Com vídeos</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer text-base text-gray-700 group">
                      <input
                        type="checkbox"
                        checked={filters.verified}
                        onChange={(e) =>
                          setFilters((f) => ({ ...f, verified: e.target.checked }))
                        }
                        className="form-checkbox h-5 w-5 text-pink-600 rounded-md border-gray-300 focus:ring-pink-500 transition-colors"
                      />
                      <span>Perfil verificado</span>
                    </label>
                  </div>
                </div>
              )}

              {activeTab === "appearance" && (
                <div className="space-y-6">
                  {/* Filtro de Tipo de Corpo */}
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-3">Tipo de corpo</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {bodyTypes.map((bt) => (
                        <button
                          key={bt}
                          onClick={() =>
                            setFilters((f) => ({
                              ...f,
                              bodyType: f.bodyType === bt ? "" : bt,
                            }))
                          }
                          className={`py-2 px-3 rounded-lg text-sm font-medium transition-all border ${
                            filters.bodyType === bt
                              ? "bg-pink-500 text-white border-pink-500 shadow-sm"
                              : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                          }`}
                        >
                          {bt}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Filtro de Cor do Cabelo */}
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-3">Cor do cabelo</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {hairColors.map((hc) => (
                        <button
                          key={hc}
                          onClick={() =>
                            setFilters((f) => ({
                              ...f,
                              hairColor: f.hairColor === hc ? "" : hc,
                            }))
                          }
                          className={`py-2 px-3 rounded-lg text-sm font-medium transition-all border ${
                            filters.hairColor === hc
                              ? "bg-pink-500 text-white border-pink-500 shadow-sm"
                              : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                          }`}
                        >
                          {hc}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Filtro de Cor dos Olhos */}
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-3">Cor dos olhos</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {eyeColors.map((ec) => (
                        <button
                          key={ec}
                          onClick={() =>
                            setFilters((f) => ({
                              ...f,
                              eyeColor: f.eyeColor === ec ? "" : ec,
                            }))
                          }
                          className={`py-2 px-3 rounded-lg text-sm font-medium transition-all border ${
                            filters.eyeColor === ec
                              ? "bg-pink-500 text-white border-pink-500 shadow-sm"
                              : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                          }`}
                        >
                          {ec}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "services" && (
                <div className="space-y-6">
                  {/* Filtro de Serviços Oferecidos */}
                  <div>
                    <label className="block text-base font-medium text-gray-700 mb-3">Serviços</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {servicesList.map((s) => (
                        <label key={s} className="flex items-center gap-3 cursor-pointer text-sm sm:text-base text-gray-700 group">
                          <input
                            type="checkbox"
                            checked={filters.services.includes(s)}
                            onChange={(e) =>
                              setFilters((f) => ({
                                ...f,
                                services: e.target.checked
                                  ? [...f.services, s]
                                  : f.services.filter((x) => x !== s),
                              }))
                            }
                            className="form-checkbox h-5 w-5 text-pink-600 rounded-md border-gray-300 focus:ring-pink-500 transition-colors"
                          />
                          <span>{s}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* Filtro de Disponibilidade */}
                  <div>
                    <label htmlFor="availability" className="block text-base font-medium text-gray-700 mb-3">Disponibilidade</label>
                    <select
                      id="availability"
                      value={filters.availability}
                      onChange={(e) =>
                        setFilters((f) => ({ ...f, availability: e.target.value }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 focus:ring-pink-500 focus:border-pink-500 text-base"
                    >
                      <option value="">Qualquer horário</option>
                      <option value="morning">Manhã</option>
                      <option value="afternoon">Tarde</option>
                      <option value="night">Noite</option>
                      <option value="24h">24 horas</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Rodapé do Modal (Ações) */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex flex-col sm:flex-row gap-3 shadow-inner-top z-10 rounded-b-3xl">
              <button
                onClick={reset}
                className="flex-1 border border-gray-300 rounded-xl py-2.5 text-gray-700 font-semibold hover:bg-gray-100 transition-colors text-base"
              >
                Limpar filtros
              </button>
              <button
                onClick={apply}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl py-2.5 font-semibold shadow-md hover:from-pink-600 hover:to-purple-700 transition-all text-base"
              >
                Aplicar filtros
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * QuickFilters Component
 * Exibe um conjunto de filtros de alternância rápida para critérios de pesquisa comuns.
 * Agora rolável horizontalmente em dispositivos móveis.
 * @param {object} props - Propriedades do componente.
 * @param {function} props.onChange - Função de callback quando um filtro é alternado.
 * @param {string[]} props.active - Array de IDs de filtro ativos.
 * @returns {JSX.Element} A seção de filtros rápidos.
 */
function QuickFilters({ onChange, active }) {
  const opts = [
    { id: "online", label: "Online agora", icon: "🟢" },
    { id: "verified", label: "Verificadas", icon: "✅" },
    { id: "photos", label: "Com fotos", icon: "📸" },
    { id: "videos", label: "Com vídeos", icon: "🎥" },
    { id: "recent", label: "Recentes", icon: "🆕" },
    { id: "premium", label: "Premium", icon: "⭐" },
    { id: "newbies", label: "Novatas", icon: "✨" },
    { id: "blonde", label: "Loiras", icon: "👱‍♀️" },
    { id: "brunette", label: "Morenas", icon: "👩‍🦳" },
  ];

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
    >
      <div className="flex flex-nowrap overflow-x-auto custom-scrollbar-x pb-2 -mb-2 sm:flex-wrap sm:overflow-x-visible sm:pb-0 sm:mb-0 justify-start sm:justify-center lg:justify-start gap-2 sm:gap-3">
        {opts.map((f) => (
          <motion.button
            key={f.id}
            onClick={() => onChange(f.id)}
            className={`flex-shrink-0 flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              active.includes(f.id)
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-pink-50 hover:border-pink-200"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{f.icon}</span>
            <span>{f.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

/**
 * SearchInput Component
 * Fornece uma barra de pesquisa para acompanhantes.
 */
function SearchInput({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >

    </motion.div>
  );
}

/**
 * ResultControls Component
 * Exibe a contagem de perfis encontrados e controles para classificação e filtros avançados.
 * Estilo e alinhamento aprimorados.
 * @param {object} props - Propriedades do componente.
 * @param {number} props.count - Número de perfis encontrados.
 * @param {string} props.sortBy - Opção de classificação atual.
 * @param {function} props.onSort - Função de callback para alterar a classificação.
 * @param {boolean} props.show - Controla a visibilidade do dropdown de classificação.
 * @param {function} props.toggle - Função para alternar o dropdown de classificação.
 * @param {function} props.open - Função para abrir o modal de filtros avançados.
 * @returns {JSX.Element} A seção de controles de resultado.
 */
function ResultControls({ count, sortBy, onSort, show, toggle, open }) {
  const opts = [
    { id: "recent", label: "Mais recentes" },
    { id: "popular", label: "Mais populares" },
    { id: "rating", label: "Melhor avaliadas" },
    { id: "price_low", label: "Menor preço" },
    { id: "price_high", label: "Maior preço" },
    { id: "online", label: "Online primeiro" },
  ];
  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.9 }}
    >
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-200/50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
          <div className="text-center sm:text-left w-full sm:w-auto">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 flex items-center justify-center sm:justify-start gap-2">
              <MapPin size={22} className="text-pink-500" weight="fill" />
              {count} perfis encontrados em Lins
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm flex items-center justify-center sm:justify-start gap-1">
              <Clock size={14} className="text-gray-400" />
              Última atualização: {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="relative">
              <button
                onClick={toggle}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl text-gray-700 font-medium hover:bg-gray-200 transition-colors text-sm"
                aria-haspopup="true"
                aria-expanded={show}
              >
                Ordenar por
                {show ? <CaretUp size={16} /> : <CaretDown size={16} />}
              </button>
              <AnimatePresence>
                {show && (
                  <motion.div
                    className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 sm:py-2 z-20 text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {opts.map((o) => (
                      <button
                        key={o.id}
                        onClick={() => { onSort(o.id); toggle(); }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                          sortBy === o.id ? "text-pink-600 font-semibold" : "text-gray-700"
                        }`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.button
              onClick={open}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl shadow-md hover:from-pink-600 hover:to-purple-700 transition-colors text-sm font-semibold"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Funnel size={16} weight="bold" /> Filtros
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * CompanionGrid Component
 * Exibe uma grade responsiva de cartões de acompanhantes ou uma mensagem se nenhum resultado for encontrado.
 * Estilo aprimorado para resultados não encontrados e apresentação de cartões.
 * @param {object} props - Propriedades do componente.
 * @param {Array<object>} props.companions - Array de dados de acompanhantes para exibir.
 * @param {object} props.statusMap - Mapa de IDs de usuário para seus status online.
 * @returns {JSX.Element} A grade de acompanhantes ou uma mensagem de resultados não encontrados.
 */
function CompanionGrid({ companions, statusMap }) {
  if (companions.length === 0) {
    return (
      <motion.div
        className="text-center py-12 sm:py-24 bg-white/70 backdrop-blur-lg rounded-3xl mx-4 sm:mx-auto max-w-lg shadow-xl border border-gray-200/50"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <Sparkle size={72} className="text-gray-300 mx-auto mb-6" weight="duotone" />
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-3">Ops! Nenhum resultado encontrado</h3>
        <p className="text-gray-500 mb-6 sm:mb-8 px-6 text-base sm:text-lg">
          Não encontramos perfis em Lins com os filtros selecionados.
          Tente ajustar suas preferências ou explore outras cidades em São Paulo.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
          <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl shadow-md hover:from-pink-600 hover:to-purple-700 transition-colors text-base font-semibold">
            Ajustar Filtros
          </button>
          <Link href="/">
            <button className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 transition-colors text-base">
              Explorar Todas as Cidades
            </button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 mb-12"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2 }}
    >
      {companions.map((c, i) => {
        const dark = c.subscriptions?.some(
          (s) => s.extraPlan?.name === "DarkMode" || s.extraPlan?.name === "Plano Nitro"
        );
        let Card = CardVIP;

        if (c.plan?.name === "Plano Rubi") Card = dark ? CardRubiDark : CardRubi;
        else if (c.plan?.name === "Plano Safira") Card = dark ? CardSafiraDark : CardSafira;
        else if (c.plan?.name === "Plano Pink") Card = dark ? CardPinkDark : CardPink;
        else if (c.plan?.name === "Plano Vip") Card = dark ? CardVIPDark : CardVIP;

        return (
          <motion.div
            key={c.userId || i}
            className="group relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href={`/perfil/${slugify(c.userName)}`}>
              <div className="overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out">
                <Card {...c} isOnline={statusMap[c.userId] === "online"} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

/**
 * Componente da página principal para Acompanhantes em Lins, SP.
 * Ele integra todos os subcomponentes para formar o layout completo da página com UI/UX refinado.
 * @returns {JSX.Element} A página AcompanhantesLins.
 */
export default function AcompanhantesLinsClient() {
  const city = "Lins";
  const stateUF = "SP";

  const { companions, fetchCompanions, loading } = usePlan();
  const [quickFiltersActive, setQuickFiltersActive] = useState([]);
  const [showAdvancedFiltersModal, setShowAdvancedFiltersModal] = useState(false);
  const [sortBy, setSortBy] = useState("recent");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const statusMap = useStatusTracker();

  // Novo estado para o termo de pesquisa
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCompanions(city, stateUF);
  }, [fetchCompanions, city, stateUF]);

  // Aplica a filtragem por termo de pesquisa (exemplo básico)
  const filteredAndSearchedCompanions = Array.isArray(companions)
    ? companions.filter(
        (c) =>
          c.documentStatus === "APPROVED" &&
          c.profileStatus === "ACTIVE" &&
          c.plan &&
          (searchTerm === "" || c.userName.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  function toggleQuickFilter(id) {
    setQuickFiltersActive((currentActive) =>
      currentActive.includes(id) ? currentActive.filter((x) => x !== id) : [...currentActive, id]
    );
  }

  function handleApplyAdvancedFilters(filters) {
    console.log("Filtros avançados aplicados:", filters);
    setShowAdvancedFiltersModal(false);
  }

  // Estilos de barra de rolagem personalizados para elementos overflow-x-auto
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .custom-scrollbar-x::-webkit-scrollbar {
        height: 6px;
      }
      .custom-scrollbar-x::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }
      .custom-scrollbar-x::-webkit-scrollbar-thumb {
        background: #e0e0e0;
        border-radius: 10px;
      }
      .custom-scrollbar-x::-webkit-scrollbar-thumb:hover {
        background: #c0c0c0;
      }
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #e0e0e0;
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #c0c0c0;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gray-50">
      {/* Fundo com gradiente sutil e padrão */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-white to-pink-50/30 -z-10" />

      <Navbar bgColor="white" />

      {loading && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-white/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Image src="/iconOficial_faixaRosa.png" alt="Carregando" width={120} height={120} className="animate-pulse" />
          <p className="ml-4 text-pink-600 text-xl font-semibold">Carregando perfis ...</p>
        </motion.div>
      )}

      <main className="flex-1 pt-20 sm:pt-28 pb-10 sm:pb-16 z-10">
        {/* Breadcrumbs para navegação */}
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 text-sm text-gray-700 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link href="/" className="text-pink-500 hover:text-pink-700 transition-colors font-medium">
            Início
          </Link>
          <span className="text-gray-400">/</span>
          <span>Acompanhantes</span>
          <span className="text-gray-400">/</span>
          <span className="font-semibold text-pink-600">
            Acompanhantes em Lins – SP
          </span>
        </motion.div>

        {/* Seção Hero - Título principal e texto descritivo */}
        <motion.div
          className="text-center mt-6 sm:mt-10 mb-10 sm:mb-14 px-4 sm:px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-700 leading-tight tracking-tight">
            Acompanhantes  em Lins – SP
          </h1>
          <p className="text-gray-700 mt-3 sm:mt-4 text-lg sm:text-xl max-w-3xl mx-auto font-light">
            Conecte-se com perfis verificados e desfrute de experiências únicas, seguras e inesquecíveis na vibrante cidade de Lins.
          </p>
          {/* Destaques principais para confiança e qualidade */}
          <motion.div
            className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6 sm:mt-8 text-gray-600 text-sm sm:text-base font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
              <ShieldCheck className="text-green-500" size={20} weight="fill" />
              <span>{filteredAndSearchedCompanions.length} Perfis Verificados</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
              <Star className="text-yellow-500" size={20} weight="fill" />
              <span>Avaliações Reais</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
              <Camera className="text-blue-500" size={20} weight="fill" />
              <span>Fotos Autênticas</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Input de Pesquisa */}
        <SearchInput onSearch={setSearchTerm} />

        {/* Seção de Stories */}
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <Stories cidade={`Lins`} estado={`SP`} />
        </motion.div>

        {/* Seção de Filtros Rápidos */}
        <QuickFilters onChange={toggleQuickFilter} active={quickFiltersActive} />

        {/* Seção de Controles de Resultado (Contagem, Ordenação, Botão de Filtros Avançados) */}
        <ResultControls
          count={filteredAndSearchedCompanions.length}
          sortBy={sortBy}
          onSort={setSortBy}
          show={showSortDropdown}
          toggle={() => setShowSortDropdown((prev) => !prev)}
          open={() => setShowAdvancedFiltersModal(true)}
        />

        {/* Seção de Grade de Acompanhantes */}
        <CompanionGrid companions={filteredAndSearchedCompanions} statusMap={statusMap} />

        {/* Modal de Filtros Avançados */}
        <FiltrosAvancados
          isOpen={showAdvancedFiltersModal}
          onClose={() => setShowAdvancedFiltersModal(false)}
          onApplyFilters={handleApplyAdvancedFilters}
        />
      </main>
    </div>
  );
}