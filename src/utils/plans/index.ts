

export type PlanDetailProps = {
    maxServices: number;
}

export type PlansProps = {
    BASIC: PlanDetailProps;
    PROFESSIONAL: PlanDetailProps;
}

export const PLANS: PlansProps = {
    BASIC: {
        maxServices: 10,
    },
    PROFESSIONAL: {
        maxServices: 50,   
    }
}

export const subscriptionPlans = [
    {
        id: "BASIC",
        name: "Basic",
        description: "Perfeito para empresas menores",
        oldPrice: "R$ 179,90",
        price: "R$ 79,99",
        features: [
            ` Até ${PLANS["BASIC"].maxServices} Serviços`,
            'Agendamentos ilimitados',
            'Suporte',
        ]

    },
    {
        id: "PROFESSIONAL",
        name: "Profissional",
        description: "Ideal para empresas grandes",
        oldPrice: "R$ 297,90",
        price: "R$ 179,99",
        features: [
            ` Até ${PLANS["PROFESSIONAL"].maxServices} Serviços`,
            'Agendamentos ilimitados',
            'Suporte prioritario',
            'Até 200 SMS'
        ]

    }
]