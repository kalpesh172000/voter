import { startAnchor } from 'solana-bankrun'
import { BankrunProvider } from 'anchor-bankrun'
import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import { Voter } from '../target/types/voter'

import idl from '../target/idl/voter.json'

const PROGRAM_ID = new PublicKey('GpCjJo1DqXs4qPkiCW7DaX8ggxVKTvczDLZ7Rk3uCRbu')

describe('voter', () => {
    let context
    let provider
    let voterPogram

    beforeAll(async () => {
        context = await startAnchor('', [{ name: 'voter', programId: PROGRAM_ID }], [])
        provider = new BankrunProvider(context)
        //eureka moment idl as unknown as Voter // i used 'as Idl' i didn't specify the <Voter>
        voterPogram = new Program<Voter>(idl as unknown as Voter, provider)
    })

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
        await voterPogram.methods.initializeCandidate('kalpesh patil', new anchor.BN(1)).rpc()

        const [candidateAddress] = PublicKey.findProgramAddressSync(
            [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from('kalpesh patil')],
            PROGRAM_ID,
        )

        const candidate = await voterPogram.account.candidate.fetch(candidateAddress)

        console.log(candidate)
        expect(candidate.candidateName).toEqual('kalpesh patil')
        expect(candidate.candidateVotes.toNumber()).toEqual(0)
    })

    it('Vote', async () => {
        const candidate_name = 'kalpesh patil'
        const poll_id = new anchor.BN(1)
        const [candidateAddress] = PublicKey.findProgramAddressSync(
            [poll_id.toArrayLike(Buffer, 'le', 8), Buffer.from(candidate_name)],
            PROGRAM_ID,
        )
        let candidate = await voterPogram.account.candidate.fetch(candidateAddress)
        expect(candidate.candidateVotes.toNumber()).toEqual(0)

        await voterPogram.methods.vote('kalpesh patil', new anchor.BN(1)).rpc()

        console.log()
        candidate = await voterPogram.account.candidate.fetch(candidateAddress)
        expect(candidate.candidateVotes.toNumber()).toEqual(1)

        await voterPogram.methods.vote('kalpesh patil', new anchor.BN(1)).rpc()

        candidate = await voterPogram.account.candidate.fetch(candidateAddress)
        expect(candidate.candidateVotes.toNumber()).toEqual(2)
    })

    it('Check votes', async () => {
        const [candidateAddress] = PublicKey.findProgramAddressSync(
            [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from('kalpesh patil')],
            PROGRAM_ID,
        )
        const candidate = await voterPogram.account.candidate.fetch(candidateAddress)
        console.log(candidate)
    })
})
