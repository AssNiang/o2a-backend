FROM node:18

# Working dir
WORKDIR /usr/src/app

# Copy Package Json Files
COPY package*.json ./

# Install Files
RUN npm install

# Copy Source Files
COPY . .

# # Build
# RUN npm run build


# Expose the API Port
EXPOSE 5000

CMD ["node", "app.js"]