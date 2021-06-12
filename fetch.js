const requestURL = "https://jsonplaceholder.typicode.com/users";

function sendRequest(method, url, body = null) {
  const headers = {
    "Content-Type": "application/json",
  };

  return fetch(url, {
    method: method,
    body: JSON.stringify(body),
    headers: headers,
  }).then((response) => {
    if (response.status < 400) {
      return response.json();
    }
    return response.json().then((error) => {
      const er = new Error("Something went wrong!");
      er.data = error;
      throw er;
    });
  });
}

// sendRequest("GET", requestURL)
//   .then((data) => console.log(data))
//   .catch((err) => console.log(err));

sendRequest("POST", requestURL, {
  name: "Vladilen",
  age: "26",
})
  .then((data) => console.log(data))
  .catch((err) => console.log(err));
