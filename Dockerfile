FROM ruby:3.3-slim AS build
WORKDIR /site

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    git \
    pkg-config \
 && rm -rf /var/lib/apt/lists/*

COPY Gemfile Gemfile.lock ./
RUN gem install bundler:2.3.0 \
 && bundle config set path /usr/local/bundle \
 && bundle install

COPY . .

FROM ruby:3.3-slim
WORKDIR /site

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
 && rm -rf /var/lib/apt/lists/*

COPY --from=build /usr/local/bundle /usr/local/bundle
COPY --from=build /site /site

RUN useradd -m -u 1000 jekyll && chown -R jekyll:jekyll /site
USER jekyll

EXPOSE 4000
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0"]
