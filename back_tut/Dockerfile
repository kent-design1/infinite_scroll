# ── Layer 1 ──────────────────────────────────────────────
# Start from an official Node.js image from Docker Hub
# Think of this as: "give me a fresh Linux machine with Node 18 already installed"
# "alpine" is a tiny Linux distro — keeps the image small (50MB vs 900MB)
FROM node:18-alpine

# ── Layer 2 ──────────────────────────────────────────────
# Set the working directory INSIDE the container
# Every command after this runs from /app inside the container
# If /app doesn't exist, Docker creates it
WORKDIR /app

# ── Layer 3 ──────────────────────────────────────────────
# Copy ONLY package.json and package-lock.json first
# The * means "package.json AND package-lock.json if it exists"
# We do this before copying our code — explained below
COPY package*.json ./

# ── Layer 4 ──────────────────────────────────────────────
# Install dependencies inside the container
# This runs npm install on Linux inside the container
RUN npm install

# ── Layer 5 ──────────────────────────────────────────────
# NOW copy the rest of your code
# The first dot = everything in your project folder on your machine
# The second dot = paste it into /app inside the container
COPY . .

# ── Layer 6 ──────────────────────────────────────────────
# Tell Docker this app listens on port 5000
# This is just documentation — it doesn't actually open the port
# The actual opening happens when you run the container
EXPOSE 5000

# ── Layer 7 ──────────────────────────────────────────────
# The command that runs when the container starts
# Same as typing "node src/index.js" in your terminal
CMD ["node", "src/index.js"]