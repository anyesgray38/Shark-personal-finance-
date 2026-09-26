# Shark Personal Finance

Personal finance system for continuously funding bills, savings goals, and investments.

## Bills funding engine

The system converts monthly obligations into the amount that must be reserved at shorter intervals.

For total monthly bills **M**:

- Annual = `M × 12`
- Biweekly = `annual ÷ 26`
- Weekly = `annual ÷ 52`
- Daily = `annual ÷ 365`

Example for **$1,000/month**:

| Period | Required reserve |
| --- | ---: |
| Monthly | $1,000.00 |
| Biweekly | $461.54 |
| Weekly | $230.77 |
| Daily | $32.88 |

Annualization avoids the common error of treating every month as exactly four weeks.

## Principles

- Store money as integer cents.
- Never fabricate balances, transactions, returns, or account data.
- Recalculate funding requirements whenever bills change.
- Required bills are funded before discretionary savings/investing allocations.
- Keep financial calculations deterministic and testable.

## Planned modules

1. Bills and due dates
2. Daily funding dashboard
3. Income/paycheck allocation
4. Savings goals and emergency fund
5. Investing allocation
6. Transaction ledger and cash-flow history
7. Optional account integrations
