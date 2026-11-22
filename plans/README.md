# Animation Improvement Plans

| # | Title | Severity | Category | Status |
| --- | --- | --- | --- | --- |
| [001](./001-dialog-exit-animation.md) | Fix Dialog exit animation unmounting and timing | HIGH | Interruptibility & Easing/Duration | DONE |

## Recommended Execution Order

1. **`001-dialog-exit-animation.md`** — Standalone fix in `components/ui/dialog.tsx` restoring Radix `Portal` / `Presence` ref forwarding so `data-[state=closed]:animate-out` plays before unmount.
