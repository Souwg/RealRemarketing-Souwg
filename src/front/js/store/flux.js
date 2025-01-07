import Swal from "sweetalert2";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: localStorage.getItem("token") || null,
            user: null,
			uploadedFile: null,
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

			loginUser: async (email, password) => {
                try {
                    const response = await fetch("https://studious-palm-tree-7v4xxv5wq5x2pj99-3001.app.github.dev/api/login", {
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

			uploadFile: async (file) => {
				const formData = new FormData();
				formData.append("file", file);
		
				try {
				  const response = await fetch("https://studious-palm-tree-7v4xxv5wq5x2pj99-3001.app.github.dev/api/upload", {
					method: "POST",
					body: formData,
				  });
		
				  if (!response.ok) {
					throw new Error("Error al procesar el archivo");
				  }
		
				  const data = await response.json();
				  console.log("Archivo procesado:", data);
		
				  // Almacenar el resultado en el store (opcional)
				  setStore({ uploadedFile: data });
		
				} catch (error) {
				  console.error(error);
				  alert("Hubo un error al procesar el archivo.");
				}
			  },
		}
	};
};

export default getState;
