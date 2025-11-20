import { Deal, DealStage, Interaction, InteractionType } from "./types";

export const MOCK_DEALS: Deal[] = [
  {
    id: '1',
    clientName: 'Acme Corp',
    contactPerson: 'Wile E. Coyote',
    value: 150000,
    stage: DealStage.NEGOTIATION,
    startDate: '2023-10-15',
    lastActivity: '2023-12-20',
  },
  {
    id: '2',
    clientName: 'Stark Industries',
    contactPerson: 'Pepper Potts',
    value: 2500000,
    stage: DealStage.DISCOVERY,
    startDate: '2024-01-05',
    lastActivity: '2024-01-10',
  },
  {
    id: '3',
    clientName: 'Wayne Ent',
    contactPerson: 'Lucius Fox',
    value: 850000,
    stage: DealStage.PROPOSAL,
    startDate: '2023-11-01',
    lastActivity: '2023-12-28',
  }
];

export const MOCK_INTERACTIONS: Interaction[] = [
  {
    id: '101',
    dealId: '1',
    date: '2023-10-15',
    type: InteractionType.EMAIL,
    content: 'Initial outreach to Mr. Coyote. Discussed supply chain optimization for fast-moving avian targets.',
    aiFeedback: {
        critical_score: 3,
        mistakes: [
            "Too polite. Offered discount immediately.",
            "Failed to establish value before pricing.",
            "No clear call to action."
        ],
        immediate_action: "Send a follow-up clarifying the unique value of the anvil speed."
    },
    createdAt: 1697328000000,
  },
  {
    id: '102',
    dealId: '1',
    date: '2023-11-20',
    type: InteractionType.MEETING,
    content: 'Demo of the ACME Anvil 3000. Client was concerned about gravity reliability.',
    aiFeedback: {
        critical_score: 6,
        mistakes: [
            "Focused on features (gravity) not benefits (catching the bird).",
            "Allowed client to control the frame."
        ],
        immediate_action: "Send case study of successful roadrunner captures."
    },
    createdAt: 1700438400000,
  }
];