# Step 1: Use official Node.js base image
FROM node:18

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy only package files first (to leverage Docker cache)
COPY package.json package-lock.json ./

# Step 4: Install dependencies
RUN npm install --production

# Step 5: Copy the rest of the backend code
COPY . .

# Step 6: Expose backend port (commonly 3000 or as per your server)
EXPOSE 3000

# Step 7: Start the app
CMD ["node", "index.js"]
