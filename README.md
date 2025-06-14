
# Arista EOS Switch Manager

A modern web-based management interface for Arista EOS switches, built with React, TypeScript, and Tailwind CSS.

## Quick Installation (Recommended)

This application is developed and tested on **Ubuntu 22.04.5 Server**, which is the recommended platform.

### Ubuntu 22.04.5 Server (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bufanoc/arista-web-commander
   cd arista-web-commander
   ```

2. **Run the automated installation script:**
   ```bash
   chmod +x install.sh
   sudo ./install.sh
   ```

3. **Access the application:**
   - The script will display your server IP address
   - Open your browser and navigate to `http://YOUR_SERVER_IP`

The installation script automatically handles all prerequisites, builds the application, configures Nginx, and sets up firewall rules.

### Other Supported Operating Systems

This application should also work on:

- **Ubuntu 20.04 LTS and newer** - Fully supported
- **Debian 11 (Bullseye) and newer** - Should work with minor modifications to package manager commands
- **CentOS/RHEL 8+** - Requires changing `apt` to `yum`/`dnf` in the script
- **Fedora 35+** - Requires changing package manager commands
- **macOS** - For development only (modify script to use `brew` instead of `apt`)

For non-Ubuntu systems, you may need to modify the `install.sh` script to use the appropriate package manager.

## Manual Installation (Development)

If you prefer manual installation or are using a different operating system:

### Prerequisites

- Node.js 16+ and npm
- Git
- Build tools (`build-essential` on Ubuntu)

### Steps

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev

# Or build for production
npm run build
npm run preview
```

## Features

- **Switch Discovery** - Automatically discover Arista switches on your network
- **Real-time Monitoring** - Monitor switch status, interfaces, and performance
- **Configuration Management** - View and manage switch configurations
- **Command Center** - Execute commands across multiple switches
- **Modern UI** - Built with React and Tailwind CSS for a responsive experience

## Prerequisites for Arista Switches

Before using this application, ensure your Arista switches have eAPI enabled:

```bash
# On each Arista switch
configure
management api http-commands
   no shutdown
exit
copy running-config startup-config
```

## Management

After installation, use these commands for application management:

```bash
# Update the application
sudo /usr/local/bin/update-arista-manager

# Switch between development and production modes
~/arista-manager-scripts/start-dev.sh      # Development mode
~/arista-manager-scripts/start-production.sh  # Production mode
~/arista-manager-scripts/stop-dev.sh       # Stop development mode
```

## Project Development

**URL**: https://lovable.dev/projects/b6ce5875-58d2-457f-9012-eccc5dad1a47

### How can I edit this code?

**Use Lovable** (Recommended)

Simply visit the [Lovable Project](https://lovable.dev/projects/b6ce5875-58d2-457f-9012-eccc5dad1a47) and start prompting. Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

Clone this repo and push changes. Pushed changes will also be reflected in Lovable.

Requirements: Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm i
npm run dev
```

**Edit directly in GitHub**

Navigate to desired files and click the "Edit" button (pencil icon).

**Use GitHub Codespaces**

Click "Code" → "Codespaces" → "New codespace" on the repository main page.

## Technologies

This project is built with:

- **Vite** - Build tool and development server
- **TypeScript** - Type-safe JavaScript
- **React** - UI framework
- **shadcn-ui** - Component library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Query** - Data fetching and state management

## Deployment

**Via Lovable**: Open [Lovable](https://lovable.dev/projects/b6ce5875-58d2-457f-9012-eccc5dad1a47) and click Share → Publish.

**Custom Domain**: Navigate to Project > Settings > Domains and click Connect Domain.

Read more: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Documentation

- [Installation Guide](README-INSTALLATION.md) - Detailed installation and troubleshooting
- [Lovable Documentation](https://docs.lovable.dev/) - Platform documentation

## Security Notes

This application is designed for lab and development environments. For production use, consider:
- Setting up HTTPS with SSL certificates
- Implementing proper authentication
- Network segmentation
- Regular security updates

## Support

For issues:
1. Check the [Installation Guide](README-INSTALLATION.md) troubleshooting section
2. Verify network connectivity to Arista switches
3. Ensure switches have eAPI enabled
4. Check system requirements for your operating system
