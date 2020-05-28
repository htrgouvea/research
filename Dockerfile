FROM jekyll/jekyll:latest
MAINTAINER  Heitor Gouvêa hi@heitorgouvea.me

EXPOSE 4000

CMD ["jekyll", "serve"]