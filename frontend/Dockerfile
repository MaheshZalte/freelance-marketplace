# Frontend - React/Vite served by nginx
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL
ARG RAZORPAY_PUBLIC_KEY_ID

RUN VITE_API_URL="${VITE_API_URL}" VITE_RAZORPAY_KEY_ID="${RAZORPAY_PUBLIC_KEY_ID}" npm run build

FROM nginx:alpine

# Copy build output
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
