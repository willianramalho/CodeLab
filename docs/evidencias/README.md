# Evidências do Plano de GCS

| Arquivo | O que mostra |
|---|---|
| `push-recusado-main.png` | `git push origin main` feito pelo dono do repositório (administrador) e recusado pela proteção da branch: `GH006: Protected branch update failed ... Changes must be made through a pull request.` |

Outras evidências verificáveis no próprio GitHub:

- Fluxo de PR com revisão do par: [PR #1](https://github.com/willianramalho/CodeLab/pull/1), aprovado por `WillianRamalhoTotvs` e mergeado por squash.
- Environments `staging` e `production` (revisor obrigatório): Settings → Environments.
- Regra da `main`: Settings → Branches (PR obrigatório, 1 aprovação, histórico linear, sem exceções para administradores).
