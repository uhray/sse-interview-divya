# Exercise 1: Budget allocator

Each month a campaign's ad budget is split across traffic sources (Facebook, Google,
Indeed, our app, a connected-TV pilot...). Sources that produced leads more cheaply over
the last 30 days get a bigger share. An ops person reviews the split and clicks
**Approve**, which saves the plan and starts spending.

- `src/allocate.ts`: how the budget is split
- `src/plan.ts`: approving a plan
- `src/store.ts`: in-memory stand-in for the database (same validation as prod)
- `fixtures/campaigns.json`: this month's campaigns

```sh
npm run allocator:approve-all   # approve every fixture campaign and print the result
npx vitest exercises/01-budget-allocator
```

## The ticket

> **Approve button does nothing on some campaigns**
>
> This morning I approved this month's plans. Most went through, but **Prairie Haul -
> Dedicated** and **Blue Ridge Transport - OTR Solo** are still sitting in Draft. No error,
> nothing happens when I click it. These need to be spending by tomorrow.
>
> (from Ops)

Find out what's going on and fix it. Talk us through your thinking as you go. We care
more about how you get there than about finishing.
