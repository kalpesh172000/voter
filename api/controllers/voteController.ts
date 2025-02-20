import { ActionGetResponse, createPostResponse, LinkedAction } from '@solana/actions'
import { Connection, PublicKey, Transaction } from '@solana/web3.js'
import * as anchor from '@coral-xyz/anchor'
import { Program, BN } from '@coral-xyz/anchor'

import idl from '../../anchor/target/idl/voter.json'
import { Voter } from '../../anchor/target/types/voter.ts'

export const getPoll = async (req, res, next) => {
    try {
        const actionMetaData: ActionGetResponse = {
            icon: 'https://images.unsplash.com/photo-1739403386250-080677ac4c53?q=80&w=1980&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            title: 'red and orange',
            description: 'choose your favourite colour',
            label: 'vote',
            links: {
                actions: [
                    {
                        label: 'Red',
                        href: '/api/vote/Red',
                    },
                    {
                        label: 'Orange',
                        href: '/api/vote/Orange',
                    },
                ] as LinkedAction[],
            },
        }
        return res.status(200).json(actionMetaData)
    } catch (error) {
        next(error)
    }
}

export const votePoll = async (req, res, next) => {
    try {
        const candidate = req.params.candidate
        if (candidate != 'Red' && candidate != 'Orange') {
            return res.status(400).json({ success: false, msg: 'Invalid parameter' })
        }
        const voter = new PublicKey(req.body.account)
        console.log('adress: ', voter.toBase58())
        console.log('candidate', candidate)

        const connection = new Connection('http://127.0.0.1:8899', 'confirmed')
        const program: Program<Voter> = new Program<Voter>(idl as Voter, { connection })

        const instruction = await program.methods
            .vote(candidate, new BN(1))
            .accounts({
                signer: voter,
            })
            .instruction()
        const blockhash = await connection.getLatestBlockhash()

        const transaction = new Transaction({
            feePayer: voter,
            blockhash: blockhash.blockhash,
            lastValidBlockHeight: blockhash.lastValidBlockHeight,
        }).add(instruction)

        /* console.log('this is transaction', transaction) */

        const response = await createPostResponse({
            fields: {
                type: 'transaction',
                transaction,
            },
        })

        console.log('Transaction before sending:', {
            feePayer: transaction.feePayer?.toBase58(),
            recentBlockhash: transaction.recentBlockhash,
            instructions: transaction.instructions,
        })
        console.log('this is response', response)

        return res.json(response)
    } catch (error) {
        next(error)
    }
}
