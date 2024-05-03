export default {
  getToken,
};

function getToken() {
  let token = localStorage.getItem(`token`);
  if (token) return { token };
  return null;
}
