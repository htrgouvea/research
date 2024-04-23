FROM jekyll/jekyll:latest
LABEL maintainer="Heitor Gouvêa <contact@heitorgouvea.me>"

COPY . /site
WORKDIR /site

RUN gem install bundler:2.3.0
RUN bundle install

EXPOSE 4000
USER jekyll

CMD ["jekyll", "serve"]