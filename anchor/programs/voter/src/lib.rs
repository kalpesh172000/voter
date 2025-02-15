#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod voter {
    use super::*;

  pub fn close(_ctx: Context<CloseVoter>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.voter.count = ctx.accounts.voter.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.voter.count = ctx.accounts.voter.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeVoter>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.voter.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeVoter<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Voter::INIT_SPACE,
  payer = payer
  )]
  pub voter: Account<'info, Voter>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseVoter<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub voter: Account<'info, Voter>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub voter: Account<'info, Voter>,
}

#[account]
#[derive(InitSpace)]
pub struct Voter {
  count: u8,
}
