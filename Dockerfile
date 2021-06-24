FROM jekyll/jekyll:latest
LABEL maintainer="Heitor Gouvêa <hi@heitorgouvea.me>"

EXPOSE 4000

COPY . /site
WORKDIR /site

RUN gem install bundler:1.17.2
RUN bundle install 

CMD ["jekyll", "serve"]