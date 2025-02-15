import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Voter} from '../target/types/voter'

describe('voter', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Voter as Program<Voter>

  const voterKeypair = Keypair.generate()

  it('Initialize Voter', async () => {
    await program.methods
      .initialize()
      .accounts({
        voter: voterKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([voterKeypair])
      .rpc()

    const currentCount = await program.account.voter.fetch(voterKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Voter', async () => {
    await program.methods.increment().accounts({ voter: voterKeypair.publicKey }).rpc()

    const currentCount = await program.account.voter.fetch(voterKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Voter Again', async () => {
    await program.methods.increment().accounts({ voter: voterKeypair.publicKey }).rpc()

    const currentCount = await program.account.voter.fetch(voterKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Voter', async () => {
    await program.methods.decrement().accounts({ voter: voterKeypair.publicKey }).rpc()

    const currentCount = await program.account.voter.fetch(voterKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set voter value', async () => {
    await program.methods.set(42).accounts({ voter: voterKeypair.publicKey }).rpc()

    const currentCount = await program.account.voter.fetch(voterKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the voter account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        voter: voterKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.voter.fetchNullable(voterKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
