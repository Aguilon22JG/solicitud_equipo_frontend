#!/bin/bash

# Solicitud de Equipos - Frontend Setup Script
echo "Configurando Sistema de Gestión de Equipos Universitarios"
echo "========================================================="

# Check Node.js version
node_version=$(node -v 2>/dev/null)
if [ $? -ne 0 ]; then
    echo "Node.js no está instalado. Instale Node.js 16 o superior."
    exit 1
fi

echo "Node.js detectado: $node_version"

# Install dependencies
echo "Instalando dependencias..."
npm install

# Copy environment file
if [ ! -f ".env" ]; then
    echo "Creando archivo de configuración..."
    cp .env.example .env
    echo "Por favor configure las variables en el archivo .env"
fi

# Run linting
echo "Ejecutando validaciones de código..."
npm run lint:fix

echo ""
echo "¡Configuración completada!"
echo ""
echo "Comandos disponibles:"
echo "  npm start          - Iniciar en desarrollo"
echo "  npm run build      - Construir para producción"  
echo "  npm test           - Ejecutar tests"
echo "  npm run lint       - Verificar código"
echo ""
echo "La aplicación estará disponible en:"
echo "  http://localhost:3000"
echo ""
echo "Para más información, consulte el README.md"
echo ""
echo "Para iniciar el servidor de desarrollo, ejecute:"
echo "  npm start"