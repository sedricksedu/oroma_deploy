# Oroma TV Deployment Guide

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- At least 2GB RAM and 10GB disk space

### Basic Deployment

1. **Extract the deployment package**
   ```bash
   unzip oromatv-deployment.zip
   cd oromatv-deployment
   ```

2. **Start the application**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Main site: http://localhost:5000
   - Admin dashboard: http://localhost:5000/admin
   - Default admin credentials: username: `admin`, password: `admin123`

### Production Deployment with Nginx

1. **Enable production profile**
   ```bash
   docker-compose --profile production up -d
   ```

2. **Configure SSL (recommended)**
   - Place SSL certificates in `nginx/ssl/`
   - Update `nginx/nginx.conf` with your domain
   - Uncomment HTTPS server block

### Environment Configuration

Create a `.env` file for production:
```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=file:./database.sqlite
SESSION_SECRET=your-super-secure-session-secret-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-admin-password
```

### Database Persistence

The SQLite database is mounted as a volume to ensure data persistence across container restarts.

### Health Monitoring

- Health check endpoint: `/api/news`
- Docker health checks configured
- Nginx upstream monitoring

### Security Features

✅ **Implemented Security Measures:**
- Rate limiting on API endpoints
- Security headers (XSS, IFRAME, CSP)
- Non-root container user
- Input validation with Zod schemas
- Secure session management
- CSRF protection
- SQL injection prevention

### Scaling Considerations

For high-traffic deployments:

1. **Load Balancing**
   ```yaml
   # Add to docker-compose.yml
   deploy:
     replicas: 3
   ```

2. **Database Upgrade**
   - Consider PostgreSQL for production
   - Update DATABASE_URL environment variable

3. **CDN Integration**
   - Configure static asset serving
   - Set up media streaming CDN

### Monitoring & Logs

```bash
# View application logs
docker-compose logs -f oromatv-app

# Monitor resource usage
docker stats oromatv-streaming-platform

# Check health status
docker-compose ps
```

### Backup Strategy

```bash
# Backup database
docker cp oromatv-streaming-platform:/app/database.sqlite ./backups/

# Backup with timestamp
docker cp oromatv-streaming-platform:/app/database.sqlite ./backups/database-$(date +%Y%m%d-%H%M%S).sqlite
```

### Troubleshooting

**Common Issues:**

1. **Port conflicts**
   ```bash
   # Change ports in docker-compose.yml
   ports:
     - "8080:5000"  # Use port 8080 instead
   ```

2. **Database permissions**
   ```bash
   # Fix database permissions
   docker exec -it oromatv-streaming-platform chown -R nextjs:nodejs /app/database.sqlite
   ```

3. **Memory issues**
   ```bash
   # Add memory limits
   deploy:
     resources:
       limits:
         memory: 1G
   ```

### Updates & Maintenance

```bash
# Update to latest version
docker-compose pull
docker-compose up -d

# Clean up old images
docker system prune -a
```

## Support & Documentation

- **Security Analysis**: See `SECURITY_ANALYSIS.md`
- **Project Documentation**: See `replit.md`
- **Admin Features**: Full dashboard with real-time analytics
- **Streaming**: Live TV and radio with HLS support

## Production Checklist

- [ ] Change default admin password
- [ ] Configure SSL certificates
- [ ] Set up domain name
- [ ] Configure firewall rules
- [ ] Set up monitoring alerts
- [ ] Configure automated backups
- [ ] Test disaster recovery
- [ ] Review security settings