import test from "node:test";
import assert from "node:assert/strict";
import { billFundingPace, dollarsToCents, fundingPaceFromMonthly } from "../src/finance.js";

test("$1,000 monthly produces the correct annualized funding pace", () => {
  const pace = fundingPaceFromMonthly(dollarsToCents(1000));
  assert.equal(pace.monthlyCents, 100000);
  assert.equal(pace.annualCents, 1200000);
  assert.equal(pace.biweeklyCents, 46154);
  assert.equal(pace.weeklyCents, 23077);
  assert.equal(pace.dailyCents, 3288);
});

test("multiple bills aggregate before calculating funding pace", () => {
  const pace = billFundingPace([
    { id: "rent", name: "Rent", monthlyCents: 80000 },
    { id: "phone", name: "Phone", monthlyCents: 10000 },
    { id: "insurance", name: "Insurance", monthlyCents: 10000 },
  ]);
  assert.equal(pace.monthlyCents, 100000);
  assert.equal(pace.weeklyCents, 23077);
});

test("invalid money is rejected", () => {
  assert.throws(() => fundingPaceFromMonthly(-1));
  assert.throws(() => fundingPaceFromMonthly(10.5));
});
