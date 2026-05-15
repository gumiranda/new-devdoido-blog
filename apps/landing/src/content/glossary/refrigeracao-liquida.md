---
title: "Refrigeração Líquida: Data Centers e Impacto Hídrico"
description: "Entenda o que é refrigeração líquida (liquid cooling), os tipos (direct-to-chip, imersão), e por que ela não elimina o consumo de água em data centers."
term: "Refrigeração Líquida"
relatedTerms: ["pue", "wue", "data-center"]
pubDate: 2026-05-15
modifiedDate: 2026-05-15
---

## Definição

**Refrigeração líquida** é uma tecnologia de resfriamento de servidores que utiliza líquidos (em vez de ar) para dissipar o calor gerado pelos componentes eletrônicos. É uma técnica adotada em data centers modernos que buscam maior densidade de processamento e menor PUE.

## Tipos de refrigeração líquida

### 1. Direct-to-Chip (DTC)

O líquido refrigerante circula por cold plates fixados diretamente sobre a CPU/GPU. É o tipo mais comum e o que a RT-One declara usar.

- **Eficiência:** Remove ~70–80% do calor dos chips
- **PUE típico:** 1,1–1,2
- **Desvantagem:** Ainda precisa de ar para os demais componentes

### 2. Refrigeração por imersão

Os servidores são completamente submersos em um fluido dielétrico (não condutor). O líquido absorve o calor e é resfriado em trocadores externos.

- **Eficiência:** Remove ~100% do calor
- **PUE típico:** 1,02–1,05
- **Desvantagem:** Manutenção mais complexa

### 3. Rear-door heat exchanger

Radiadores montados na parte traseira dos racks de servidores. O ar quente passa pelo radiador antes de sair do rack.

- **Eficiência:** Moderada
- **PUE típico:** 1,2–1,3

## Vantagens sobre refrigeração a ar

| Característica | Ar | Líquido |
|---------------|-----|---------|
| PUE típico | 1,5–2,0 | 1,02–1,3 |
| Densidade de racks | 5–15 kW | 20–100+ kW |
| Ruído | Alto (ventiladores) | Baixo |
| Espaço físico | Maior | Menor |

## O mito do "zero consumo de água"

Empresas frequentemente vendem a refrigeração líquida como "zero consumo de água". Na prática:

1. **Circuito fechado não significa zero consumo**: O sistema perde água por evaporação e purga
2. **A água ainda circula**: Precisa ser reposta periodicamente
3. **A RT-One admitiu**: Em Maringá (PR), captação direta do Aquífero Guarani para os trocadores de calor

## Caso RT-One Uberlândia

A RT-One declara usar **refrigeração líquida em circuito fechado** com PUE-alvo abaixo de 1,2. Solicitou ao DMAE o fornecimento de **2,77 L/s** (239.300 litros/dia) de água potável. Especialistas questionam:

> "Algo é 'sustentável' em relação a algum parâmetro de referência. Isso não significa que não exista impacto." — Lourenço Diniz Faria, UFU

## Termos relacionados

- [PUE (Power Usage Effectiveness)](/glossario/pue)
- [WUE (Water Usage Effectiveness)](/glossario/wue)
- [Aquífero Guarani](/glossario/aquifero-guarani)
