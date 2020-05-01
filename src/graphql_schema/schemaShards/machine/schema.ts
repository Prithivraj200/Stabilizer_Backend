import { gql } from 'apollo-server-express';

const machineTypeDef = gql`
  enum MachineType {
    SINGLE_PHASE
    THREE_PHASE
  }

  input UserMachineInput {
    name: String!
    description: String!
    machineType: MachineType!
    loadCapacity: String!
    userInput: UserInput!
  }

  input DealerMachineInput {
    name: String!
    description: String!
    machineType: MachineType!
    loadCapacity: String!
    creator: String!
  }

  type Machine {
    _id: ID!
    name: String!
    description: String!
    machineType: MachineType!
    loadCapacity: String!
    creator: User!
    createdAt: String!
    updatedAt: String!
  }

  type MachineList {
    machines: [Machine!]!
    totalCount: Int!
  }

  extend type Query {
    getMachine(id: ID!): Machine!
    getMachines(page: Int!): MachineList!
    getMachinesByUser(page: Int!, id: ID): MachineList!
  }

  extend type Mutation {
    createMachineByUser(machineInput: UserMachineInput): Message!
    createMachineByDealer(machineInput: DealerMachineInput): Message!
    editMachine(id: ID!, machineInput: DealerMachineInput): Machine!
    deleteMachine(id: ID!): Message!
  }
`;

export default machineTypeDef;
