import { billFundingPace, dollarsToCents, type Bill } from "./finance.js";

const STORAGE_KEY = "shark-personal-finance:bills:v1";
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const money = (cents: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

function loadBills(): Bill[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

let bills = loadBills();

function save(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bills));
  render();
}

function render(): void {
  const pace = billFundingPace(bills);
  $("monthly").textContent = money(pace.monthlyCents);
  $("biweekly").textContent = money(pace.biweeklyCents);
  $("weekly").textContent = money(pace.weeklyCents);
  $("daily").textContent = money(pace.dailyCents);
  $("bill-count").textContent = `${bills.length} bill${bills.length === 1 ? "" : "s"}`;
  $("empty").hidden = bills.length > 0;

  const list = $("bill-list");
  list.replaceChildren();

  for (const bill of [...bills].sort((a,b) => (a.dueDay ?? 32) - (b.dueDay ?? 32))) {
    const row = document.createElement("article");
    row.className = "bill";
    const info = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = bill.name;
    const due = document.createElement("span");
    due.textContent = bill.dueDay ? `Due day ${bill.dueDay}` : "No due date";
    info.append(name, due);

    const amount = document.createElement("strong");
    amount.textContent = money(bill.monthlyCents);

    const remove = document.createElement("button");
    remove.className = "remove";
    remove.type = "button";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => {
      bills = bills.filter(item => item.id !== bill.id);
      save();
    });

    row.append(info, amount, remove);
    list.append(row);
  }
}

$("bill-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const nameInput = $("bill-name") as HTMLInputElement;
  const amountInput = $("bill-amount") as HTMLInputElement;
  const dueInput = $("bill-due") as HTMLInputElement;
  const amount = Number(amountInput.value);
  const due = dueInput.value ? Number(dueInput.value) : undefined;

  if (!nameInput.value.trim() || !Number.isFinite(amount) || amount <= 0) return;
  if (due !== undefined && (!Number.isInteger(due) || due < 1 || due > 31)) return;

  bills.push({
    id: crypto.randomUUID(),
    name: nameInput.value.trim(),
    monthlyCents: dollarsToCents(amount),
    dueDay: due,
  });
  (event.currentTarget as HTMLFormElement).reset();
  save();
});

render();
