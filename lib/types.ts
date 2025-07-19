export interface GasPoint {
    timestamp: number;
    baseFee: number;
    priorityFee: number;
}

export interface ChainData {
    baseFee: number;
    priorityFee: number;
    history: GasPoint[];
}

export interface GasState {
    mode: "live" | "simulation";
    chains: {
        ethereum: ChainData;
        polygon: ChainData;
        arbitrum: ChainData;
    };
    usdPrice: number;
    setMode: (mode: "live" | "simulation") => void;
    updateGasData: (chain: keyof GasState["chains"], data: GasPoint) => void;
    updateUsdPrice: (price: number) => void;
}
    
export interface SimulationInput {
    amount: number;
    chain: keyof GasState["chains"];
}