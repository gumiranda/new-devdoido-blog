---
title: "Tier III e Tier IV: Confiabilidade de Data Centers"
description: "Entenda a classificação Tier (I a IV) do Uptime Institute, os requisitos de redundância e disponibilidade, e onde o data center RT-One pretende se enquadrar."
term: "Tier III / Tier IV"
relatedTerms: ["pue", "subestacao-dedicada", "refrigeracao-liquida"]
pubDate: 2026-05-15
modifiedDate: 2026-05-15
---

## Definição

A classificação **Tier** (I a IV) do **Uptime Institute** é o padrão internacional para medir a confiabilidade e disponibilidade de um data center. Cada tier define os requisitos de redundância de energia, refrigeração e infraestrutura de rede.

## Os quatro tiers

| Tier | Disponibilidade | Tempo de inatividade/ano | Redundância | Custo relativo |
|------|----------------|--------------------------|-------------|----------------|
| **I** | 99,671% | 28,8 horas | Nenhuma (componentes únicos) | 1x |
| **II** | 99,741% | 22,0 horas | Parcial (N+1 parcial) | 1,5x |
| **III** | 99,982% | 1,6 horas | N+1 completa; manutenção sem parada | 3x |
| **IV** | 99,995% | 0,4 horas | 2N+1; tolerante a falhas | 5x |

### Tier III — concurrently maintainable

- **Redundância**: N+1 em todos os sistemas (energia, refrigeração, rede)
- **Manutenção**: Equipamentos podem ser substituídos sem desligar o data center
- **Exigências**: Duas linhas de energia independentes, geradores redundantes, múltiplos chillers

### Tier IV — fault tolerant

- **Redundância**: 2N+1 (duas linhas completas + uma reserva)
- **Tolerância a falhas**: Suporta ao menos um evento não planejado sem impacto
- **Exigências**: Duas subestações independentes; refrigeração com armazenamento térmico

## Onde a RT-One se encaixa?

A RT-One **não declarou publicamente** qual certificação Tier pretende obter. No entanto, baseado nos dados disponíveis:

- **Subestação dedicada** com duas linhas de transmissão sugerem **Tier III ou IV**
- **Refrigeração líquida** é típica de data centers Tier III+
- **PUE-alvo abaixo de 1,2** é consistente com Tier III/IV

Data centers de **hiperscala** (como os da AWS, Google Cloud, Azure) geralmente operam em Tier III ou Tier IV.

## Por que o Tier importa para o impacto ambiental?

Quanto maior o Tier, **maior o consumo de energia e água**:

- **Energia**: Mais redundância = mais equipamentos ligados 24/7
- **Água**: Sistemas de refrigeração redundantes = mais torres, mais evaporação

Um data center Tier IV pode consumir até **40% mais energia** que um Tier III equivalente apenas para manter os sistemas de redundância.

## Tier vs. certificação

A classificação Tier do Uptime Institute é uma **certificação independente**. Muitos data centers se autodescrevem como "Tier III equivalentes" sem nunca terem passado pela auditoria formal. Até maio de 2026, a RT-One não declarou buscar certificação Uptime Institute.

## Termos relacionados

- [PUE (Power Usage Effectiveness)](/glossario/pue)
- [Subestação Dedicada](/glossario/subestacao-dedicada)
- [Refrigeração Líquida](/glossario/refrigeracao-liquida)
