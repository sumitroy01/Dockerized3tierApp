# Step 1: Use the official Node.js image as the base image
FROM node:18

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy only package.json and package-lock.json to leverage Docker cache
COPY package.json package-lock.json ./

# Step 4: Install dependencies (this step will be cached if package.json doesn't change)
RUN npm install

# Step 5: Copy the rest of the application code into the container
COPY . .

# Step 6: Build the Vite app for production
RUN npm run build

# Step 7: Install a static file server to serve the production build
RUN npm install -g serve

# Step 8: Expose the port that the app will be accessible on
EXPOSE 5000

# Step 9: Serve the production build using the static server
CMD ["serve", "dist"]
