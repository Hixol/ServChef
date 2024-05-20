export default {
  getToken,
  getRole,
};

function getToken() {
  let token = localStorage.getItem(`token`);
  if (token) return { token };
  return null;
}

function getRole() {
  const userData = JSON.parse(localStorage.getItem("userData"));
  if (userData && userData.role && userData.role.length > 0) {
    const roleObj = userData.role[0];
    if (roleObj.StaffGroup && roleObj.StaffGroup.staff_group_name) {
      return roleObj.StaffGroup.staff_group_name;
    }
  }
  return null;
}
