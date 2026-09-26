export type MoneyCents = number;

export interface Bill {
  id: string;
  name: string;
  monthlyCents: MoneyCents;
  dueDay?: number;
}

export interface FundingPace {
  monthlyCents: MoneyCents;
  annualCents: MoneyCents;
  biweeklyCents: MoneyCents;
  weeklyCents: MoneyCents;
  dailyCents: MoneyCents;
}

function assertMoney(cents: number): void {
  if (!Number.isSafeInteger(cents) || cents < 0) {
    throw new Error("Money must be a non-negative integer number of cents.");
  }
}

const roundCents = (value: number): MoneyCents => Math.round(value);

export function fundingPaceFromMonthly(monthlyCents: MoneyCents): FundingPace {
  assertMoney(monthlyCents);
  const annualCents = monthlyCents * 12;

  return {
    monthlyCents,
    annualCents,
    biweeklyCents: roundCents(annualCents / 26),
    weeklyCents: roundCents(annualCents / 52),
    dailyCents: roundCents(annualCents / 365),
  };
}

export function totalMonthlyBills(bills: Bill[]): MoneyCents {
  return bills.reduce((total, bill) => {
    assertMoney(bill.monthlyCents);
    return total + bill.monthlyCents;
  }, 0);
}

export function billFundingPace(bills: Bill[]): FundingPace {
  return fundingPaceFromMonthly(totalMonthlyBills(bills));
}

export function dollarsToCents(dollars: number): MoneyCents {
  if (!Number.isFinite(dollars) || dollars < 0) {
    throw new Error("Dollar amount must be a non-negative finite number.");
  }
  return Math.round(dollars * 100);
}

export function centsToDollars(cents: MoneyCents): number {
  assertMoney(cents);
  return cents / 100;
}
