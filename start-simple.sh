#!/bin/bash

echo "Starting Oroma TV Docker deployment..."

# Stop any existing containers
docker-compose -f docker-compose.simple.yml down

# Build and start the application
docker-compose -f docker-compose.simple.yml up --build -d

# Show logs
echo "Waiting for application to start..."
sleep 10

echo "Application logs:"
docker-compose -f docker-compose.simple.yml logs --tail=50

echo ""
echo "Check application status:"
echo "- Application: http://localhost:5000"
echo "- Admin Panel: http://localhost:5000/admin"
echo ""
echo "To view live logs: docker-compose -f docker-compose.simple.yml logs -f"
echo "To stop: docker-compose -f docker-compose.simple.yml down"