---
layout: page
title: Blog
---

{% for post in site.posts  %}
  {% capture this_year %}
    {{ post.date | date: "%Y" }}
  {% endcapture %}

  {% capture next_year %}
    {{ post.previous.date | date: "%Y" }}
  {% endcapture %}

  {% if forloop.first %}
  <h2 id="{{ this_year }}-ref"></h2>
  <ul>
  {% endif %}
  <li class="pv2"><a href="{{ post.url }}">{{ post.title }}</a></li>
  {% if forloop.last %}
  </ul>
  {% else %}
  {% if this_year != next_year %}
  </ul>
  <h2 id="{{ next_year }}-ref">{{next_year}}</h2>
  <ul>
  {% endif %}
  {% endif %}
{% endfor %}
