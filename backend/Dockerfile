FROM node:22-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace root files
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./

# Copy all workspace package.json files for dependency resolution
COPY backend/package.json backend/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/workflows/package.json packages/workflows/package.json
COPY packages/security/package.json packages/security/package.json
COPY packages/utils/package.json packages/utils/package.json
COPY packages/api/package.json packages/api/package.json

# Install all dependencies
RUN pnpm install --frozen-lockfile || pnpm install

# Copy shared packages source
COPY packages/ packages/

# Copy backend source + prisma schema
COPY backend/ backend/

# Generate Prisma client
RUN cd backend && npx prisma generate

WORKDIR /app/backend

EXPOSE 3105

CMD ["pnpm", "dev"]
