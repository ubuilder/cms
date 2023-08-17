import { AdminLayout } from "./AdminLayout.js";

export function load() {
  console.log('request...')
  
  return {
    user: {
      name: "hadi",
      username: "hadiahmadi",
      email: "thehadiahmadi@gmail.com",
    },
  };
}

export default AdminLayout;
