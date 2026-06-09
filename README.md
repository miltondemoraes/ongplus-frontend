# Frontend ONG+

SPA em React + Vite responsavel pela experiencia publica, area do doador, area da ONG e area administrativa do ONG+.

## Escopo de Interface

- Cadastro separado por perfil: **Sou doador** e **Sou ONG**.
- Login, recuperacao de senha e sessao persistente.
- Controle de acesso para visitante, doador, ONG e administrador.
- Tela de causas com ONGs individuais, campanhas e bundles.
- Perfil publico de ONG com score, transparencia, campanhas e evidencias.
- Fluxo de doacao para ONG, campanha individual, fundo/causa e bundle.
- Area do doador com historico, recibos, preferencias e impacto.
- Area de gestao da ONG com perfil, documentos, redes sociais, campanhas, doadores, relatorios e solicitacoes de urgencia.
- Area administrativa para validar documentos, ONGs, campanhas, conteudo, score e solicitacoes.
- Tela de transparencia refeita para exibir dados verificaveis por ONG, campanha, bundle e urgencia.
- Tela Sobre refeita para explicar projeto, matchfunding, score, verificacao e funcionamento das doacoes.

## Comandos

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Documentacao Relacionada

- [Estado de mocks e integracao](../docs/estado-mocks-e-integracao.md)
- [Workflow do doador](../docs/workflow/client_workflow.md)
- [Workflow da ONG](../docs/workflow/ong_workflow.md)
