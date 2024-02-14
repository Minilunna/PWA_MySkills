import API_BASE_URL from "@/config";

function authHeader() {
    const token = JSON.parse(localStorage.getItem('token'));
    if (token) {
        return { 'x-access-token': token };
    } else {
        return {};
    }
}

function handleResponses(response) {
    let message = "";
    switch (response.status) {
        case 401:
            message = "Unauthorized access, please login again.";
            break;
        case 403:
            message = "Forbidden access, please check your credentials.";
            break;
        case 406:
            message = "Resource already exists.";
            break;
        default:
            message = "An error occurred, please try again later.";
            break;
    }
    throw new Error(message);
}

async function get(url, headers = {}) {
    const response = await fetch(API_BASE_URL + url, {
        headers: {
            ...authHeader(),
            ...headers
        }
    });

    if (response.ok) {
        return await response.json();
    } else {
        throw Error(handleResponses(response.status));
    }
}

async function post(url, data, headers = {}) {
    const response = await fetch(API_BASE_URL + url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            ...authHeader(),
            ...headers
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        return await response.json();
    } else {
        throw Error(handleResponses(response.status));
    }
}

async function put(url, data, headers = {}) {
    const response = await fetch(API_BASE_URL + url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            ...authHeader(),
            ...headers
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        return await response.json();
    } else {
        throw Error(handleResponses(response));
    }
}

async function remove(url, headers = {}) {
    const response = await fetch(API_BASE_URL + url, {
        method: "DELETE",
        headers: {
            ...authHeader(),
            ...headers
        }
    });

    if (response.ok) {
        return await response.json();
    } else {
        throw Error(handleResponses(response));
    }
}

async function patch(url, data, headers = {}) {
    const response = await fetch(API_BASE_URL + url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        ...authHeader(),
        ...headers
      },
      body: JSON.stringify(data)
    });
  
    if (response.ok) {
      return await response.json();
    } else {
      throw Error(handleResponses(response));
    }
  }
  
  export { get, post, put, patch, remove };