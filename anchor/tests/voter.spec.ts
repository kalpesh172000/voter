import { startAnchor } from 'solana-bankrun'
import { BankrunProvider } from 'anchor-bankrun'
import * as anchor from '@coral-xyz/anchor'
import { Program, BN } from '@coral-xyz/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import { Voter } from '../target/types/voter'

import idl from '../target/idl/voter.json'

const PROGRAM_ID = new PublicKey('GpCjJo1DqXs4qPkiCW7DaX8ggxVKTvczDLZ7Rk3uCRbu')

describe('voter', () => {
    /* let provider */
    /* let context */
    anchor.setProvider(anchor.AnchorProvider.env())
    let voterPogram = anchor.workspace.Voter as Program<Voter>

    it('Initialize Poll', async () => {
        await voterPogram.methods
            .initializePoll(
                new anchor.BN(1),
                'what is your favorite fruit',
                new anchor.BN(0),
                new anchor.BN(1742049892),
            )
            .rpc()

        const [pollAddress] = PublicKey.findProgramAddressSync(
            [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
            PROGRAM_ID,
        )

        const poll = await voterPogram.account.poll.fetch(pollAddress)

        console.log(poll)

        expect(poll.pollId.toNumber()).toEqual(1)
        expect(poll.description).toEqual('what is your favorite fruit')
        expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber())
    })

    it('Initialize Candidate', async () => {
        await voterPogram.methods.initializeCandidate('Red', new anchor.BN(1)).rpc()
        await voterPogram.methods.initializeCandidate('Orange', new anchor.BN(1)).rpc()

        const [candidateAddress] = PublicKey.findProgramAddressSync(
            [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from('Red')],
            PROGRAM_ID,
        )

        const candidate = await voterPogram.account.candidate.fetch(candidateAddress)

        console.log("candidate:",candidate)
        const [candidateAddress1] = PublicKey.findProgramAddressSync(
            [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from('Red')],
            PROGRAM_ID,
        )

        const candidate1 = await voterPogram.account.candidate.fetch(candidateAddress1)

        console.log("candidate:",candidate1)
    })

    it('Vote', async () => {
        const candidate_name = 'Red'
        const candidate_name1 = 'Orange'
        const poll_id = new anchor.BN(1)

        await voterPogram.methods.vote(candidate_name, new anchor.BN(1)).rpc()
        await voterPogram.methods.vote(candidate_name1, new anchor.BN(1)).rpc()
        await voterPogram.methods.vote(candidate_name, new anchor.BN(1)).rpc()
    })
})
