export default {
  getLocation,
};

function getLocation(key = `location`) {
  let location = localStorage.getItem(key);
  if (location) return JSON.parse(location);
  return null;
}
