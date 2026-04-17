# LinkRiseUp VPS Deployment

## Files
- `Dockerfile` - production multi-stage image
- `docker-compose.vps.yml` - service definition for VPS
- `deploy/nginx/linkriseup.conf` - nginx reverse proxy template
- `deploy/scripts/deploy.sh` - one-command deploy script

## VPS setup (one-time)

```bash
sudo mkdir -p /opt/automation-sites
cd /opt/automation-sites
git clone <YOUR_LINKRISEUP_REPO_URL> linkriseup
cd linkriseup
cp .env.example .env
# edit .env values for production
```

## Deploy

```bash
cd /opt/automation-sites/linkriseup
bash deploy/scripts/deploy.sh
```

## Nginx setup

```bash
sudo cp /opt/automation-sites/linkriseup/deploy/nginx/linkriseup.conf /etc/nginx/sites-available/linkriseup.conf
sudo ln -s /etc/nginx/sites-available/linkriseup.conf /etc/nginx/sites-enabled/linkriseup.conf
sudo nginx -t
sudo systemctl reload nginx
```

## SSL (Let's Encrypt)

```bash
sudo apt update
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d linkriseup.com -d www.linkriseup.com
```

## Useful checks

```bash
docker compose -f docker-compose.vps.yml ps
docker logs -f --tail=100 linkriseup_app
curl -I http://127.0.0.1:3010/
```
