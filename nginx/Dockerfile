FROM owasp/modsecurity-crs:nginx

# 1) Set up default env vars (can still be overridden at docker-compose or runtime)
ENV SERVER_NAME=localhost \
    BACKEND=http://unused \
    BLOCKING_PARANOIA=2

#COPY ./src/Frontend /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

COPY default.conf /etc/nginx/templates/conf.d/default.conf.template

USER root
RUN chown nginx:nginx /etc/nginx/nginx.conf \
                   /etc/nginx/templates/conf.d/default.conf.template

# volta a rodar como default user (nginx)
USER nginx

EXPOSE 80 8443