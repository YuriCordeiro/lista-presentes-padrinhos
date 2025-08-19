# Copilot Instructions - Lista de Presentes

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Context
Este é um projeto de Lista de Presentes elegante para padrinhos, com:
- **Frontend**: React + TypeScript + Vite + Styled Components
- **Design**: Dark theme, mobile-first, animações suaves
- **Integração**: Google Sheets para dados dos presentes
- **Features**: Carregamento progressivo, validação de imagens, PWA

## Code Style Guidelines
- Use TypeScript com tipos rigorosos
- Components funcionais com hooks
- Styled Components para estilos
- Framer Motion para animações
- Padrão de nomenclatura em português para UX
- Interface responsiva e mobile-first

## Key Features to Implement
1. **Carregamento Progressivo**: Itens aparecem conforme validados
2. **Validação de Imagens**: Só exibe produtos com fotos válidas  
3. **Ordenação**: Baseada na coluna "Ordem" do Google Sheets
4. **Animações**: Transições suaves e elegantes
5. **PWA**: Service Worker e manifest
6. **Cache**: Sistema inteligente para performance

## Google Sheets Integration
- Colunas: Título, URL do Produto, URL da Imagem, Ordem, Exibir
- Coluna "Exibir": "Sim" = mostra o item, "Não" = oculta o item
- API RESTful para comunicação
- Fallback para múltiplos proxies CORS
- Sincronização automática em background
- Filtragem automática de itens ocultos

## UI/UX Requirements
- Tema escuro elegante (#1a1a1a → #2d2d2d)
- Tipografia: Inter font family
- Animações de entrada/saída suaves
- Estados de loading informativos
- Feedback visual para interações
- Otimizado para touch devices
