// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import VoterIDL from '../target/idl/voter.json'
import type { Voter } from '../target/types/voter'

// Re-export the generated IDL and type
export { Voter, VoterIDL }

// The programId is imported from the program IDL.
export const VOTER_PROGRAM_ID = new PublicKey(VoterIDL.address)

// This is a helper function to get the Voter Anchor program.
export function getVoterProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...VoterIDL, address: address ? address.toBase58() : VoterIDL.address } as Voter, provider)
}

// This is a helper function to get the program ID for the Voter program depending on the cluster.
export function getVoterProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Voter program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return VOTER_PROGRAM_ID
  }
}
