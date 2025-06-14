
#!/bin/bash

# Arista EOS Switch Manager - Ubuntu Server Installation Script
# This script installs all prerequisites and configures the application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Get server IP address
SERVER_IP=$(ip route get 8.8.8.8 | awk -F"src " 'NR==1{split($2,a," ");print a[1]}')

print_status "Starting installation for Arista EOS Switch Manager"
print_status "Server IP detected: $SERVER_IP"

# Update system packages
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install system dependencies
print_status "Installing system dependencies..."
sudo apt install -y curl git build-essential nginx ufw

# Install Node.js (LTS version)
print_status "Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs
    print_success "Node.js installed successfully"
else
    print_success "Node.js is already installed"
fi

# Verify Node.js and npm versions
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
print_status "Node.js version: $NODE_VERSION"
print_status "npm version: $NPM_VERSION"

# Install application dependencies
print_status "Installing application dependencies..."
npm install

# Build the application
print_status "Building the application..."
npm run build

# Create application directory
APP_DIR="/var/www/arista-switch-manager"
print_status "Creating application directory: $APP_DIR"
sudo mkdir -p $APP_DIR

# Copy built files to web directory
print_status "Copying application files..."
sudo cp -r dist/* $APP_DIR/
sudo chown -R www-data:www-data $APP_DIR

# Create Nginx configuration
print_status "Configuring Nginx..."
sudo tee /etc/nginx/sites-available/arista-switch-manager > /dev/null <<EOF
server {
    listen 80;
    server_name $SERVER_IP;
    root $APP_DIR;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Handle client-side routing
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
EOF

# Enable the site
print_status "Enabling Nginx site configuration..."
sudo ln -sf /etc/nginx/sites-available/arista-switch-manager /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
print_status "Testing Nginx configuration..."
sudo nginx -t

# Configure firewall
print_status "Configuring firewall..."
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'

# Start and enable services
print_status "Starting services..."
sudo systemctl restart nginx
sudo systemctl enable nginx

# Create update script
print_status "Creating update script..."
sudo tee /usr/local/bin/update-arista-manager > /dev/null <<EOF
#!/bin/bash
cd $(pwd)
git pull origin main
npm install
npm run build
sudo cp -r dist/* $APP_DIR/
sudo systemctl reload nginx
echo "Application updated successfully!"
EOF

sudo chmod +x /usr/local/bin/update-arista-manager

# Create systemd service for development mode (optional)
print_status "Creating development service..."
sudo tee /etc/systemd/system/arista-dev.service > /dev/null <<EOF
[Unit]
Description=Arista Switch Manager Development Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=$(pwd)
Environment=NODE_ENV=development
ExecStart=/usr/bin/npm run dev -- --host 0.0.0.0 --port 5173
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload

# Create management scripts directory
SCRIPTS_DIR="$HOME/arista-manager-scripts"
mkdir -p $SCRIPTS_DIR

# Create start development mode script
tee $SCRIPTS_DIR/start-dev.sh > /dev/null <<EOF
#!/bin/bash
echo "Starting Arista Switch Manager in development mode..."
sudo systemctl start arista-dev
echo "Development server started on http://$SERVER_IP:5173"
EOF

# Create stop development mode script
tee $SCRIPTS_DIR/stop-dev.sh > /dev/null <<EOF
#!/bin/bash
echo "Stopping development mode..."
sudo systemctl stop arista-dev
echo "Development server stopped"
EOF

# Create production mode script
tee $SCRIPTS_DIR/start-production.sh > /dev/null <<EOF
#!/bin/bash
echo "Ensuring production mode is running..."
sudo systemctl stop arista-dev 2>/dev/null || true
sudo systemctl restart nginx
echo "Production server running on http://$SERVER_IP"
EOF

chmod +x $SCRIPTS_DIR/*.sh

# Final checks
print_status "Performing final checks..."

# Check if Nginx is running
if sudo systemctl is-active --quiet nginx; then
    print_success "Nginx is running"
else
    print_error "Nginx is not running"
fi

# Check if port 80 is accessible
if sudo netstat -tlnp | grep -q ":80 "; then
    print_success "Port 80 is listening"
else
    print_error "Port 80 is not listening"
fi

print_success "Installation completed successfully!"
echo ""
echo "=========================================="
echo "  Arista EOS Switch Manager - Installed"
echo "=========================================="
echo ""
echo "🌐 Web Interface: http://$SERVER_IP"
echo ""
echo "📁 Application Directory: $APP_DIR"
echo "📁 Management Scripts: $SCRIPTS_DIR"
echo ""
echo "🔧 Management Commands:"
echo "  • Update application: sudo /usr/local/bin/update-arista-manager"
echo "  • Start development mode: $SCRIPTS_DIR/start-dev.sh"
echo "  • Stop development mode: $SCRIPTS_DIR/stop-dev.sh"
echo "  • Restart production: $SCRIPTS_DIR/start-production.sh"
echo ""
echo "📋 Service Commands:"
echo "  • Restart Nginx: sudo systemctl restart nginx"
echo "  • Check Nginx status: sudo systemctl status nginx"
echo "  • View Nginx logs: sudo journalctl -u nginx -f"
echo ""
echo "🔥 Firewall Status:"
sudo ufw status
echo ""
print_success "You can now access the application at: http://$SERVER_IP"
echo ""
print_warning "Note: Make sure your Arista switches are accessible from this server"
print_warning "and that the eAPI is enabled on your switches with:"
print_warning "  management api http-commands"
print_warning "     no shutdown"
EOF

chmod +x install.sh

<lov-write file_path="README-INSTALLATION.md">
# Arista EOS Switch Manager - Installation Guide

This guide will help you install and configure the Arista EOS Switch Manager on Ubuntu 22.04.5 Server.

## Prerequisites

- Ubuntu 22.04.5 Server
- Root or sudo access
- Internet connection
- Network access to your Arista switches

## Quick Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd <repository-name>
   ```

2. **Run the installation script:**
   ```bash
   chmod +x install.sh
   sudo ./install.sh
   ```

3. **Access the application:**
   - Open your browser and navigate to `http://YOUR_SERVER_IP`
   - The script will display your server IP at the end of installation

## What the Script Does

The installation script automatically:

- ✅ Updates system packages
- ✅ Installs Node.js (LTS) and npm
- ✅ Installs system dependencies (git, build-essential, nginx, ufw)
- ✅ Installs application dependencies
- ✅ Builds the production application
- ✅ Configures Nginx as reverse proxy
- ✅ Sets up firewall rules
- ✅ Creates management scripts
- ✅ Configures the application to be accessible via server IP

## Post-Installation

### Accessing the Application
- **Production Mode:** `http://YOUR_SERVER_IP` (default)
- **Development Mode:** `http://YOUR_SERVER_IP:5173` (optional)

### Management Commands

**Update the application:**
```bash
sudo /usr/local/bin/update-arista-manager
```

**Switch to development mode:**
```bash
~/arista-manager-scripts/start-dev.sh
```

**Switch to production mode:**
```bash
~/arista-manager-scripts/start-production.sh
```

**Stop development mode:**
```bash
~/arista-manager-scripts/stop-dev.sh
```

### Service Management

**Nginx (Web Server):**
```bash
sudo systemctl status nginx    # Check status
sudo systemctl restart nginx   # Restart
sudo systemctl reload nginx    # Reload configuration
sudo journalctl -u nginx -f    # View logs
```

**Development Service:**
```bash
sudo systemctl status arista-dev    # Check status
sudo systemctl start arista-dev     # Start
sudo systemctl stop arista-dev      # Stop
```

## Firewall Configuration

The script automatically configures UFW firewall:
- SSH (port 22) - Allowed
- HTTP (port 80) - Allowed
- HTTPS (port 443) - Allowed

Check firewall status:
```bash
sudo ufw status
```

## Troubleshooting

### Application Not Accessible
1. Check if Nginx is running: `sudo systemctl status nginx`
2. Check firewall: `sudo ufw status`
3. Verify server IP: `ip addr show`

### Permission Issues
```bash
sudo chown -R www-data:www-data /var/www/arista-switch-manager
sudo systemctl restart nginx
```

### Port Conflicts
If port 80 is already in use:
```bash
sudo netstat -tlnp | grep :80
sudo systemctl stop apache2  # If Apache is running
sudo systemctl restart nginx
```

### View Logs
```bash
# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -f
```

## Arista Switch Configuration

Before using the application, ensure your Arista switches have eAPI enabled:

```bash
# On each Arista switch
configure
management api http-commands
   no shutdown
exit
copy running-config startup-config
```

## Security Notes

- This application is designed for lab environments
- For production use, consider:
  - Setting up HTTPS with SSL certificates
  - Implementing proper authentication
  - Network segmentation
  - Regular security updates

## Directory Structure

```
/var/www/arista-switch-manager/     # Application files
~/arista-manager-scripts/           # Management scripts
/etc/nginx/sites-available/         # Nginx configuration
/usr/local/bin/update-arista-manager # Update script
```

## Support

If you encounter issues:
1. Check the logs (see Troubleshooting section)
2. Verify network connectivity to switches
3. Ensure Arista switches have eAPI enabled
4. Check Ubuntu system requirements
