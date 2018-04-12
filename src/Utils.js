export const getCsrfToken = () => {
    return new Promise((resolve, reject) => {
      fetch("/site/csrf", {
        method: "GET",
        accept: "application/json",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Произошла ошибка!");
          }
          return response.json();
        })
        .then(csrf => {
          resolve(csrf);
        })
        .catch(error => {
          reject(error.message);
        });
    });
  }