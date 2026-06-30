# Contributing to flashpod

Thanks for helping make `flashpod` useful. The project is intentionally small:
TypeScript should make the RunPod Flash path easier without pretending the
official Flash deployment machinery needs to be rewritten on day one.

## Local setup

Run checks:

```bash
npm install
npm run check
```

Useful focused commands:

```bash
npm run test:unit
npm run test:e2e
npm run test:package
```

## Project boundaries

- TypeScript should own the user-facing config, CLI, and client.
- The official Flash CLI should own deploy/build/dev for now.
- Generated Python should stay boring, readable, and easy to delete.

Good first changes:

- Typed config helpers for Flash features that are already public.
- Better generated bridge coverage with tests.
- Clearer examples and docs.
- Client behavior fixes that improve type safety or error messages.

Avoid:

- Replacing the official Flash CLI without a tested public API contract.
- Adding generated Python that is clever, stateful, or hard to inspect.
- Shipping browser examples that expose `RUNPOD_API_KEY`.

## Pull requests

Before opening a PR:

1. Keep the change focused.
2. Add or update tests for behavior changes.
3. Run `npm run check`.
4. Update docs when user-facing behavior changes.
