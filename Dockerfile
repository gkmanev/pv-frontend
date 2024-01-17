# Build step 1(installing node modules and preparing compiled build)

# Use an official Node.js image as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .
# Build the Vue.js application
RUN npm run build

# Exporse the port where the Vue.js application will run
EXPOSE 80

# Set the entrypoint as the Vue.js application command
ENTRYPOINT ["npm", "run", "serve"]


# Build step 2(Deploying build on NGINX)
FROM nginx:1.17
RUN  apt-get update \
  && apt-get install -y wget \
  && rm -rf /var/lib/apt/lists/*
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf:ro
COPY --from=build /app/dist /usr/share/nginx/html