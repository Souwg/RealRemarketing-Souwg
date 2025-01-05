import Swal from "sweetalert2";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: localStorage.getItem("token") || null,
            user: null,
		},
		actions: {
			signupUser: async (name, last_name, email, password) => {
				try {
					const response = await fetch(`https://studious-palm-tree-7v4xxv5wq5x2pj99-3001.app.github.dev/api/signup`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							name: name,
							last_name: last_name,
							email: email,
							password: password,
						}),
					});

					if (response.ok) {
						const data = await response.json();
						console.log("Usuario registrado:", data.user);
						return data;
					} else {
						const errorData = await response.json();
						console.error("Error en el registro:", errorData.msg);
						return { error: true, msg: errorData.msg }; 
					}
				} catch (error) {
					console.error("Error en el registro:", error);
					return { error: true, msg: "Error en la solicitud" };
				}
			},

			login: async (email, password) => {
                try {
                    const response = await fetch("http://localhost:5000/api/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password }),
                    });

                    if (!response.ok) throw new Error("Invalid login credentials");

                    const data = await response.json();
                    localStorage.setItem("token", data.token);
                    setStore({ token: data.token, user: data.user });
                    return true;
                } catch (error) {
                    console.error("Login error:", error);
                    return false;
                }
            },
            logout: () => {
                localStorage.removeItem("token");
                setStore({ token: null, user: null });
            },
		}
	};
};

export default getState;
