const backendURL = process.env.BACKEND_URL
const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: localStorage.getItem("token") || null,
            user: null,
			uploadedFile: null,
			parcels: [],
		},
		actions: {
			//action Register user and admin
			signupUser: async (name, last_name, email, password) => {
				try {
					const response = await fetch(backendURL + `signup`, {
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
			//action login user and admin 
			loginUser: async (email, password) => {
                try {
                    const response = await fetch(backendURL + "login", {
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

			//action upload files
			uploadFile: async (file) => {
				const formData = new FormData();
				formData.append("file", file);
		
				try {
				  const response = await fetch(backendURL + "upload", {
					method: "POST",
					body: formData,
				  });
		
				  if (!response.ok) {
					throw new Error("");
				  }
		
				  const data = await response.json();
				  console.log("Archivo procesado:", data);
		
				  // Almacenar el resultado en el store (opcional)
				  setStore({ uploadedFile: data });
				} catch (error) {
				  console.error(error);
				  console.log("Hubo un error al procesar el archivo.");
				  throw error;
				}
			  },

			  //action delete all files
			  deleteAllFiles: async () => {
				try {
					const response = await fetch(backendURL + "delete-all-files", {
						method: "DELETE",
					});
			
					if (!response.ok) {
						const errorData = await response.json();
						throw new Error(errorData.error || "Error desconocido");
					}
			
					const data = await response.json();
				
					console.log("Todos los registros han sido eliminados correctamente.");
				} catch (error) {
					console.error("Error al eliminar los registros:", error.message);
					alert("Hubo un error al intentar eliminar los registros: " + error.message);
				}
			},
			
			//get action files from data
			getAllFiles: async () => {
				try {
					const response = await fetch(backendURL + "files", {
						method: "GET",
					});
			
					if (!response.ok) {
						const errorData = await response.json();
						throw new Error(errorData.error || "Error desconocido");
					}
					const data = await response.json();
					return data;
				} catch (error) {
					console.error("Error al obtener la lista de archivos:", error.nessage);
					return [];
				}
			},
			
			  uploadParcels: async (parcels) => {
				try {
					console.log("Parcels enviados al backend:", parcels);
				  const response = await fetch(backendURL + "uploadproperties", {
					method: "POST",
					headers: {
					  "Content-Type": "application/json",
					},
					body: JSON.stringify({ parcels }),
				  });
		
				  if (!response.ok) {
					throw new Error("Failed to upload properties");
				  }
		
				  const data = await response.json();
				  console.log("Upload success:", data);
				  
				  return data;
				} catch (error) {
				  console.error("Error uploading parcels:", error);
				  throw error;
				}
			  },	  
		}
	};
};

export default getState;
