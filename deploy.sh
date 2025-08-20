#!/bin/bash

# Deploy Script - Lista de Presentes dos Padrinhos
# Uso: ./deploy.sh [vercel|netlify|build]

set -e

echo "🎁 Lista de Presentes - Deploy Script"
echo "======================================"

case "$1" in
  "vercel")
    echo "📦 Building aplicação..."
    npm run build
    
    echo "🚀 Deploy para Vercel..."
    vercel --prod
    
    echo "✅ Deploy concluído! Verifique: https://your-project.vercel.app"
    ;;
    
  "netlify")
    echo "📦 Building aplicação..."
    npm run build
    
    echo "🚀 Deploy para Netlify..."
    netlify deploy --prod --dir=dist
    
    echo "✅ Deploy concluído!"
    ;;
    
  "build")
    echo "📦 Building aplicação para produção..."
    npm run build
    
    echo "📊 Informações do build:"
    echo "- Frontend: dist/ folder criado"
    echo "- Backend: server/ folder pronto"
    echo "- Tamanho: $(du -sh dist/ | cut -f1)"
    
    echo "✅ Build concluído!"
    echo "💡 Para deploy:"
    echo "   - Vercel: ./deploy.sh vercel"
    echo "   - Netlify: ./deploy.sh netlify"
    echo "   - Manual: Copie dist/ e server/ para seu servidor"
    ;;
    
  *)
    echo "❓ Uso: ./deploy.sh [vercel|netlify|build]"
    echo ""
    echo "Opções:"
    echo "  build    - Apenas build a aplicação"
    echo "  vercel   - Build + Deploy para Vercel"
    echo "  netlify  - Build + Deploy para Netlify"
    echo ""
    echo "📚 Para mais informações, veja: PRODUCTION_DEPLOY.md"
    exit 1
    ;;
esac
