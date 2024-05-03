export default {
  getToken,
  getRole,
};

function getToken() {
  let token = localStorage.getItem(`token`);
  if (token) return { token };
  return null;
}

// function getRole() {
//   let role = localStorage.getItem(`staff_role_name`);
//   if (role) return { role };
//   return null;
// }

function getRole() {
  let roles = JSON.parse(localStorage.getItem("role"));

  if (roles && roles.length > 0) {
    let roleObj = roles[0];
    if (roleObj.StaffGroup && roleObj.StaffGroup.staff_group_name) {
      return roleObj.StaffGroup.staff_group_name;
    } else {
      return null;
    }
  }

  return null;
}
