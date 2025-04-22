import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

const ModalEditarPlano = ({
    anunciante,
    planos,
    planosExtras,
    userToken,
    onClose,
    onSalvarPlanoBasico,
    onSalvarPlanoExtra,
}) => {
    const [selectedPlano, setSelectedPlano] = useState(anunciante.plan?.id || null);
    const [selectedPlanoExtra, setSelectedPlanoExtra] = useState(
        anunciante.subscriptions?.map((sub) => sub.extraPlan?.id) || []
    );

    const [planoAlterado, setPlanoAlterado] = useState(false);
    const [extrasAlterados, setExtrasAlterados] = useState(false);
    const [planoSalvo, setPlanoSalvo] = useState(false);
    const [extrasSalvos, setExtrasSalvos] = useState(false);

    const toggleExtra = (id) => {
        setSelectedPlanoExtra((prev) => {
            const updated = prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id];
            setExtrasAlterados(true);
            setExtrasSalvos(false);
            return updated;
        });
    };

    const handleSalvarPlanoBasico = async () => {
        await onSalvarPlanoBasico(anunciante.id, selectedPlano, userToken, anunciante.plan?.id, () => { });
        setPlanoAlterado(false);
        setPlanoSalvo(true);
    };

    const handleSalvarPlanoExtra = async () => {
        await onSalvarPlanoExtra(anunciante.id, selectedPlanoExtra, userToken, () => { });
        setExtrasAlterados(false);
        setExtrasSalvos(true);
    };

    return (
        <div className="space-y-6 text-gray-800">
            <h2 className="text-2xl font-bold">Editar Plano de {anunciante.name}</h2>

            {/* Plano atual com destaque */}
            <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">Plano Básico Atual</label>
                <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-200 rounded-md shadow-inner">
                    <span className="text-indigo-700 font-semibold text-base">
                        {anunciante.plan?.name || "Nenhum plano atribuído"}
                    </span>
                    <span className="text-indigo-500 font-medium">
                        {anunciante.plan?.price?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) || ""}
                    </span>
                </div>
            </div>

            {/* Escolha do novo plano estilo cards */}
            <div>
                <label className="block text-sm font-medium mb-2 text-gray-600">Selecionar Novo Plano</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {planos.map((plano) => {
                        const selected = selectedPlano === plano.id;
                        return (
                            <div
                                key={plano.id}
                                onClick={() => {
                                    setPlanoAlterado(true);
                                    setSelectedPlano(plano.id);
                                }}
                                className={`cursor-pointer border rounded-lg p-3 transition hover:shadow-md ${selected ? "bg-indigo-100 border-indigo-500 ring-2 ring-indigo-500" : "bg-white border-gray-200"
                                    }`}
                            >
                                <p className="font-medium text-gray-800">{plano.name}</p>
                                <p className="text-sm text-gray-600">
                                    {plano.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>


            {/* Planos extras com design moderno */}
            <div>
                <label className="block text-sm font-medium mb-2 text-gray-600">Planos Extras</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {planosExtras.map((extra) => {
                        const selected = selectedPlanoExtra.includes(extra.id);
                        return (
                            <div
                                key={extra.id}
                                onClick={() => toggleExtra(extra.id)}
                                className={`cursor-pointer border rounded-lg p-3 transition hover:shadow-lg ${selected ? "bg-pink-100 border-pink-500" : "bg-white border-gray-200"
                                    } flex items-center justify-between`}
                            >
                                <div>
                                    <p className="font-medium">{extra.name}</p>
                                    <p className="text-sm text-gray-600">R$ {extra.price}</p>
                                </div>
                                {selected && <FaCheckCircle className="text-pink-600 text-xl" />}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Botões de ação */}
            <div className="flex flex-wrap justify-between items-center gap-4 pt-4">
                <div className="flex gap-4">
                    {planoAlterado && (
                        <button
                            onClick={handleSalvarPlanoBasico}
                            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition font-medium"
                        >
                            Salvar Plano Básico
                        </button>
                    )}
                    {planoSalvo && !planoAlterado && (
                        <span className="text-green-600 font-medium">Plano salvo</span>
                    )}

                    {extrasAlterados && (
                        <button
                            onClick={handleSalvarPlanoExtra}
                            className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700 transition font-medium"
                        >
                            Salvar Planos Extras
                        </button>
                    )}
                    {extrasSalvos && !extrasAlterados && (
                        <span className="text-green-600 font-medium">Extras salvos</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalEditarPlano;
