var formData = new FormData();

formData.append("csrfmiddlewaretoken", "UthJBGKstXGetbZDBdW1hgt2oyiaTOss");
formData.append("name", "teste");
formData.append("company_name", "teste");
formData.append("unique_identifier", "0003");
formData.append("billing_emails", "test@abc.com");
formData.append("country", "17");
formData.append("region", "222");
formData.append("city", "4739");
formData.append("address", "tws");
formData.append("complement", "ts");
formData.append("postal_code", "3454356");



var request = new XMLHttpRequest();

request.open("POST", "https://stage-manager.azion.com/account/665/");
request.setRequestHeader("Cookie", "csrftoken=UthJBGKstXGetbZDBdW1hgt2oyiaTOss");
request.send(formData);
