FROM node:18-alpine

WORKDIR /app

# Install yarn (use --force to overwrite if exists)
RUN npm install -g yarn --force || true

# Copy package files
COPY package*.json ./
COPY yarn.lock* ./

# Install dependencies with yarn
# Use --ignore-engines to handle @achrinza/node-ipc Node.js version conflict
RUN yarn install --ignore-engines --frozen-lockfile || \
    (sleep 5 && yarn install --ignore-engines --frozen-lockfile) || \
    (sleep 10 && yarn install --ignore-engines --frozen-lockfile)

# Copy source code
COPY . .

# Expose port
EXPOSE 8080

# Start development server
CMD ["npm", "run", "serve"]

