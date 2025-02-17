#![allow(clippy::result_large_err)]
#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;

declare_id!("GpCjJo1DqXs4qPkiCW7DaX8ggxVKTvczDLZ7Rk3uCRbu");

#[program]
pub mod voter {
    use super::*;

    //instruction initialize_poll
    pub fn initialize_poll(
        ctx: Context<InitializePoll>,
        poll_id: u64,
        description: String,
        poll_start: u64,
        poll_end: u64,
    ) -> Result<()> {
        let poll = &mut ctx.accounts.poll;
        poll.poll_id = poll_id;
        poll.description = description;
        poll.poll_start = poll_start;
        poll.poll_end = poll_end;
        poll.candidate_amount = 0;
        Ok(())
    }

    pub fn initialize_candidate(
        ctx: Context<InitializeCandidate>,
        candidate_name: String,
        _poll_id: u64,
    ) -> Result<()> {
        let candidate = &mut ctx.accounts.candidate;
        let poll = &mut ctx.accounts.poll;
        poll.candidate_amount += 1;
        msg!("candidate_amount: {}",poll.candidate_amount);
        candidate.candidate_name = candidate_name;
        candidate.candidate_votes = 0;
        Ok(())
    }

    pub fn vote(
        ctx: Context<Vote>,
        _candidate_name: String,
        _poll_id: u64
    ) -> Result<()> {
        let candidate = &mut ctx.accounts.candidate;
        candidate.candidate_votes += 1;
        msg!("candidate_votes: {}",candidate.candidate_votes);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(poll_id: u64)]
pub struct InitializePoll<'info> {
    #[account(mut)] //mutable cause we are getting money from it also more
    pub signer: Signer<'info>,

    #[account(
        init, //automatically initialize the poll when you call the initialize_poll instruction
        payer = signer,
        space = 8 + Poll::INIT_SPACE,
        seeds = [poll_id.to_le_bytes().as_ref()],
        bump
    )]
    pub poll: Account<'info, Poll>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Poll {
    pub poll_id: u64,
    #[max_len(280)]
    pub description: String,
    pub poll_start: u64,
    pub poll_end: u64,
    pub candidate_amount: u64,
}

#[derive(Accounts)]
#[instruction(candidate_name:String, poll_id:u64)]
pub struct InitializeCandidate<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    
    //we need poll in initialize_candidate cause we need to incriment the candidate_amount in poll
    #[account(
        // we dont need to specify same things second time casue we are just referencing it.
        mut,
        seeds = [poll_id.to_le_bytes().as_ref()],
        bump
    )]
    pub poll: Account<'info, Poll>,

    #[account(
        init,
        payer = signer,
        space = 8 + Candidate::INIT_SPACE,
        seeds = [poll_id.to_le_bytes().as_ref(), candidate_name.as_bytes()],
        bump
    )]
    pub candidate: Account<'info, Candidate>,

    pub system_program: Program<'info, System>,
}


#[account]
#[derive(InitSpace)]
pub struct Candidate {
    #[max_len(64)]
    pub candidate_name: String,
    pub candidate_votes: u64
}

#[derive(Accounts)]
#[instruction(candidate_name:String, poll_id:u64)]
pub struct Vote<'info> {
    // #[account()]
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [poll_id.to_le_bytes().as_ref(), candidate_name.as_bytes()],
        bump
    )]
    pub candidate: Account<'info, Candidate>,

    //you can remove this if you are not creating system accounts
    // pub system_program: Program<'info, System>,
}






