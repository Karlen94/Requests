function nothing() {}

class CreatePromise {
  constructor(executor) {
    this.arr = [];
    this.errorHendler = nothing;
    this.finallyHendler = nothing;

    try {
      executor.call(null, this.onResolve.bind(this), this.onReject.bind(this));
    } catch (e) {
      this.errorHendler(e);
    } finally {
      this.finallyHendler();
    }
  }

  onResolve(data) {
    this.arr.map((callback) => {
      data = callback(data);
    });

    this.finallyHendler();
  }

  onReject(error) {
    this.errorHendler(error);
    this.finallyHendler();
  }

  then(fn) {
    this.arr.push(fn);
    return this;
  }

  catch(fn) {
    this.errorHendler = fn;
    return this;
  }

  finally(fn) {
    this.finallyHendler = fn;
    return this;
  }

  static all(promisesArray) {
    let results = [];
    return new CreatePromise((resolve, reject) => {
      for (let promise of promisesArray) {
        promise.then((resolveChild) => {
          results.push(resolveChild);
          if (results.length === promisesArray.length) {
            resolve(results);
          } else {
            reject(err);
          }
        });
      }
    });
  }
}

const requestURL = "https://jsonplaceholder.typicode.com/users";

function ajax(url, { type = "GET", data = null, heders = {} }) {
  return new CreatePromise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open([type], url);
    xhr.responseType = "json"; 

    for (let prop in heders) {
      xhr.setRequestHeader(prop, heders[prop]);
    }

    xhr.onload = () => {
      if (xhr.status >= 400) {
        resolve(xhr.response);
      } else {
        reject(xhr.response);
      }
    };

    xhr.onerror = () => {
      reject(xhr.response);
    };

    xhr.send(JSON.stringify(data));
  });
}

const body = {
  name: "Max",
  age: 5,
};

const myheder = {
  ["content-type"]: "application/json",
};

const configs = {
  type: "POST",
  data: body,
  heders: myheder,
};

ajax(requestURL, configs)
  .then((data) => console.log(data))
  .catch((err) => console.log(err));

// ajax(requestURL, "GET")
//   .then((data) => console.log(data))
//   .catch((err) => console.log(err));
