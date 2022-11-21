# Ask Almog: what does it mean -rf?
# and why do i need here 2 Initialization and what are there meaning?
# Stage 1 - build application
FROM node:12 as build-stage
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install -f
COPY . .
RUN npm run build


# Stage 2 - serve static files
FROM nginx:alpine
RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html
#COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

WORKDIR /usr/share/nginx/html
COPY ./env.sh .
COPY .env .
# Add bash
RUN apk add --no-cache bash
# Make our shell script executable
RUN chmod +x env.sh
# Start Nginx server
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]
